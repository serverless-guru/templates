import type { Steps } from 'local-ts'
import type { Utils } from 'utils-ts'

import { CreateAssetCommand, MediaPackageVodClient } from '@aws-sdk/client-mediapackage-vod'

interface CreatePackage {
  id: string
  smilKey: string
  bucket: string
  role: string
  packagingGroupId: string
}
const client = new MediaPackageVodClient({})

/** Ingest new assets into MediaPackage
 */
export async function createPackage(
  params: CreatePackage,
  context: Utils.Context,
): Promise<Steps.Endpoints> {
  const sourceArn = `arn:aws:s3:::${params.bucket}/${params.smilKey}`

  const command = new CreateAssetCommand({
    Id: params.id,
    PackagingGroupId: params.packagingGroupId,
    SourceArn: sourceArn,
    SourceRoleArn: params.role,
  })
  const response = await client.send(command)
  if (!response.EgressEndpoints) {
    return {
      hls: '',
      dash: '',
    }
  }
  const dash =
    response.EgressEndpoints.filter((el) => el.PackagingConfigurationId === 'dash')[0].Url || ''
  const hls =
    response.EgressEndpoints.filter((el) => el.PackagingConfigurationId === 'hls')[0].Url || ''
  return {
    dash,
    hls,
  }
}
