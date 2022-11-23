import type { Steps } from 'local-ts'

import { createPackage } from '@@controllers/mediapackage'
import { LambdaLog } from 'lambda-log'

const LOCAL_ENV_VARIABLES = {
  mezzanineBucket: process.env.mezzanineBucket,
  mediaPackageRole: process.env.mediaPackageRole,
  packagingGroupId: process.env.packagingGroupId,
}

const main = async (params: Steps.PackageSourceFile): Promise<Steps.Endpoints> => {
  const { smilKey, id } = params
  const logger = new LambdaLog()

  logger.info('Params', { params, env: process.env })

  const response = await createPackage(
    {
      id,
      bucket: LOCAL_ENV_VARIABLES.mezzanineBucket,
      role: LOCAL_ENV_VARIABLES.mediaPackageRole,
      smilKey,
      packagingGroupId: LOCAL_ENV_VARIABLES.packagingGroupId,
    },
    { logger },
  )
  logger.info('response', { response })
  return response
}
export const handler = main
