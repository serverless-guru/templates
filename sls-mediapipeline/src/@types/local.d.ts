declare module 'local-ts' {
  type S3Path = `s3://${string}/${string}`

  namespace Steps {
    interface SourceFile {
      bucket: string
      key: string
    }

    interface Dimensions {
      width: number
      height: number
    }

    interface SourceInfo extends Dimensions {
      duration: number
    }

    interface ConvertSourceFile extends SourceFile {
      id: string
      dimensions: Dimensions
      duration: number
    }

    interface PackageSourceFile {
      id: string
      smilKey: string
    }

    interface Endpoints {
      dash: string
      hls: string
    }

    interface OutputDetail {
      outputFilePaths: S3Path[]
      durationInMs: number
      videoDetails: {
        widthInPx: number
        heightInPx: number
      }
    }

    interface MediaConvertStateChanged {
      timestamp: number
      accountId: string
      queue: `arn:aws:mediaconvert:${string}:${string}:queues/${string}`
      jobId: string
      status: string
      userMetadata?: {
        initiator?: string
        id?: string
      }
      outputGroupDetails?: Array<{
        outputDetails: OutputDetail[]
        type: 'FILE_GROUP'
      }>
    }

    interface CreateSmil {
      id: string
      outputDetails: OutputDetail[]
    }
  }
}
