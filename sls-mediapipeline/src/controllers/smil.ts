import type { Steps } from 'local-ts'
import type { Utils } from 'utils-ts'

import path from 'path'

import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3'

const client = new S3Client({})

interface CreateSmil extends Steps.CreateSmil {
  bucket: string
}
/**
 * Create SMIL for Output files
 */
export async function createSmil(params: CreateSmil, context: Utils.Context): Promise<string> {
  const smilContent = getSmilContent(params.outputDetails)
  const smilPath = `${params.id}/${params.id}.smil`
  const command = new PutObjectCommand({
    Bucket: params.bucket,
    Key: smilPath,
    Body: smilContent,
    ContentType: 'application/smil',
  })
  await client.send(command)
  return smilPath
}

/**
 * Build SMIL content
 */
function getSmilContent(outputDetails: Steps.OutputDetail[]): string {
  const videoFiles = outputDetails.map((rend) => {
    const filename = path.basename(rend.outputFilePaths[0])
    return `<video name="${filename}"/>`
  })
  const smil = [
    '<?xml version="1.0" encoding="utf-8"?>',
    '<smil>',
    '<body>',
    '<switch>',
    ...videoFiles,
    '</switch>',
    '</body>',
    '</smil>',
  ]

  return smil.join('\n')
}
