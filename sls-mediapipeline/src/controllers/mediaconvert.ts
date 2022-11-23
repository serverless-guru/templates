import path from 'path'

import {
  input as inputTemplate,
  job as jobTemplate,
  outputH265 as outputH265Template,
  output as outputTemplate,
  outputs as outputsFormats,
} from '@@shared/templates/mediaconvert'
import {
  CreateJobCommand,
  DescribeEndpointsCommand,
  type Job,
  MediaConvertClient,
  type Output,
} from '@aws-sdk/client-mediaconvert'
import { S3Path, Steps } from 'local-ts'
import { Utils } from 'utils-ts'

let client = new MediaConvertClient({ region: process.env.AWS_REGION })
let endpoint = ''

interface CreateJob {
  id: string
  bucket: string
  key: string
  mezzanineBucket: string
  mediaConvertRole: string
  region: string
  dimensions: Steps.Dimensions
  duration: number
  service: string
}

/**
 * Prepare config for Mediaconvert Job from the file input and templates
 */
export async function createJob(
  params: CreateJob,
  context: Utils.Context,
): Promise<Job | undefined> {
  const { id, key, bucket, mezzanineBucket, mediaConvertRole, service } = params

  if (!endpoint) {
    const endpointCommand = new DescribeEndpointsCommand({ Mode: 'DEFAULT' })
    const { Endpoints } = await client.send(endpointCommand)
    context.logger.info('endpoints', Endpoints)
    if (Endpoints && Endpoints[0] && Endpoints[0].Url) {
      endpoint = Endpoints[0].Url
      client = new MediaConvertClient({ region: params.region, endpoint })
    } else {
      throw new Error('No endpoint defined')
    }
  }

  const ext = path.extname(key)
  const basename = path.basename(key, ext)

  const fileInput: S3Path = `s3://${bucket}/${key}`
  const fileOutput: S3Path = `s3://${mezzanineBucket}/${id}/${basename}`
  const stillsOutput: S3Path = `s3://${mezzanineBucket}/${id}/frames/${basename}`

  const outputs = buildOutputs(params.dimensions.width, params.dimensions.height)

  inputTemplate.FileInput = fileInput

  const job = { ...jobTemplate }

  job.Role = mediaConvertRole
  job.UserMetadata = {
    initiator: service,
    id,
  }
  if (!job.Settings) {
    job.Settings = {}
  }
  if (!job.Settings.Inputs) {
    job.Settings.Inputs = []
  }
  job.Settings.Inputs[0] = inputTemplate

  if (
    job.Settings.OutputGroups &&
    Array.isArray(job.Settings.OutputGroups) &&
    job.Settings.OutputGroups[0] &&
    job.Settings.OutputGroups[0].OutputGroupSettings &&
    job.Settings.OutputGroups[0].OutputGroupSettings.FileGroupSettings
  ) {
    job.Settings.OutputGroups[0].OutputGroupSettings.FileGroupSettings.Destination = fileOutput
  } else {
    job.Settings.OutputGroups = [
      {
        OutputGroupSettings: {
          FileGroupSettings: {
            Destination: fileOutput,
          },
        },
      },
    ]
  }
  context.logger.info('Outputs', { outputs })
  job.Settings.OutputGroups[0].Outputs = outputs

  if (
    job.Settings.OutputGroups[1] &&
    job.Settings.OutputGroups[1].OutputGroupSettings &&
    job.Settings.OutputGroups[1].OutputGroupSettings.FileGroupSettings &&
    job.Settings.OutputGroups[1].Outputs &&
    job.Settings.OutputGroups[1].Outputs[0] &&
    job.Settings.OutputGroups[1].Outputs[0].VideoDescription &&
    job.Settings.OutputGroups[1].Outputs[0].VideoDescription.CodecSettings &&
    job.Settings.OutputGroups[1].Outputs[0].VideoDescription.CodecSettings.FrameCaptureSettings
  ) {
    job.Settings.OutputGroups[1].OutputGroupSettings.FileGroupSettings.Destination = stillsOutput
    const maxCaptures =
      job.Settings.OutputGroups[1].Outputs[0].VideoDescription.CodecSettings.FrameCaptureSettings
        .MaxCaptures || 20
    const duration = Math.max(params.duration, 20)
    const denominator = Math.floor(duration / maxCaptures)
    job.Settings.OutputGroups[1].Outputs[0].VideoDescription.CodecSettings.FrameCaptureSettings.FramerateDenominator =
      denominator
  }
  context.logger.info('Job', { job })

  const command = new CreateJobCommand(job)
  context.logger.info('Command', { client, command })
  const response = await client.send(command)
  return response.Job
}

/**
 * Build Outputs from template
 */
function buildOutputs(width: number, height: number): Output[] {
  const outputs: Output[] = []

  outputsFormats
    .filter((item) => {
      return item.Width <= width && item.Height <= height
    })
    .forEach((outputSettings) => {
      if (outputSettings.Codec === 'H_265') {
        const output: Output = JSON.parse(JSON.stringify(outputH265Template))
        output.NameModifier = `-${outputSettings.Height}p`
        if (!output.VideoDescription) {
          output.VideoDescription = {}
        }
        output.VideoDescription.Width = outputSettings.Width
        output.VideoDescription.Height = outputSettings.Height
        if (!output.VideoDescription.CodecSettings) {
          output.VideoDescription.CodecSettings = {}
        }
        if (!output.VideoDescription.CodecSettings.H265Settings) {
          output.VideoDescription.CodecSettings.H265Settings = {}
        }
        output.VideoDescription.CodecSettings.H265Settings.MaxBitrate = Number(
          outputSettings.Bitrate,
        )
        output.VideoDescription.CodecSettings.H265Settings.HrdBufferSize =
          2 * Number(outputSettings.Bitrate)
        if (outputSettings.FramerateNumerator) {
          output.VideoDescription.CodecSettings.H265Settings.FramerateNumerator = Number(
            outputSettings.FramerateNumerator,
          )
          output.VideoDescription.CodecSettings.H265Settings.FramerateDenominator = 1000
        }
        outputs.push(output)
      } else {
        const output: Output = JSON.parse(JSON.stringify(outputTemplate))
        output.NameModifier = `-${outputSettings.Height}p`
        if (!output.VideoDescription) {
          output.VideoDescription = {}
        }
        output.VideoDescription.Width = outputSettings.Width
        output.VideoDescription.Height = outputSettings.Height
        if (!output.VideoDescription.CodecSettings) {
          output.VideoDescription.CodecSettings = {}
        }
        if (!output.VideoDescription.CodecSettings.H264Settings) {
          output.VideoDescription.CodecSettings.H264Settings = {}
        }

        output.VideoDescription.CodecSettings.H264Settings.MaxBitrate = Number(
          outputSettings.Bitrate,
        )
        output.VideoDescription.CodecSettings.H264Settings.HrdBufferSize =
          2 * Number(outputSettings.Bitrate)
        output.VideoDescription.CodecSettings.H264Settings.CodecLevel =
          outputSettings.Height >= 1080 ? 'LEVEL_4_2' : 'LEVEL_3_1'
        output.VideoDescription.CodecSettings.H264Settings.CodecProfile =
          outputSettings.Height >= 1080 ? 'HIGH' : 'MAIN'
        output.VideoDescription.CodecSettings.H264Settings.NumberBFramesBetweenReferenceFrames =
          outputSettings.Height < 720 ? 3 : 1
        outputs.push(output)
      }
    })
  return outputs
}
