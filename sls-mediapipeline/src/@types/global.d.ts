declare namespace NodeJS {
  export interface ProcessEnv {
    AWS_REGION: string
    incomingBucket: string
    mezzanineBucket: string
    mediaConvertRole: string
    mediaPackageRole: string
    service: string
    packagingGroupId: string
  }
}
