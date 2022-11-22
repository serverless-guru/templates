import type { Steps } from 'local-ts'

import { exec } from 'node:child_process'
import util from 'node:util'

import { GetObjectCommand, S3Client } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { LambdaLog } from 'lambda-log'

const execPromise = util.promisify(exec)
const client = new S3Client({})

const main = async (params: Steps.SourceFile): Promise<Steps.SourceInfo> => {
  const logger = new LambdaLog()
  logger.info('Params', params)

  let srcWidth = 0
  let srcHeight = 0
  let duration = 0

  try {
    const command = new GetObjectCommand({ Bucket: params.bucket, Key: params.key })
    const inputFileUrl = await getSignedUrl(client, command, { expiresIn: 600 })

    const ffprobe = `/opt/bin/ffprobe -hide_banner -loglevel error -show_error -show_format -show_streams -print_format json "${inputFileUrl}"`

    logger.info('ffprobe cmd', { ffprobe })

    const { stdout } = await execPromise(ffprobe)
    logger.info('ffprobe out', { stdout })
    const fileMetadata = JSON.parse(stdout)
    logger.info('metadata', { fileMetadata })

    for (let i = 0; i < fileMetadata.streams.length; i++) {
      if (fileMetadata.streams[i].codec_type === 'video') {
        srcWidth = parseInt(fileMetadata.streams[i].width)
        srcHeight = parseInt(fileMetadata.streams[i].height)
        duration = parseFloat(fileMetadata.streams[i].duration)
        break
      }
    }
  } catch (err) {
    logger.error(err as Error)
  }

  return {
    width: srcWidth,
    height: srcHeight,
    duration,
  }
}
export const handler = main
