import type { Steps } from 'local-ts'

import { createJob } from '@@controllers/mediaconvert'
import { LambdaLog } from 'lambda-log'

const LOCAL_ENV_VARIABLES = {
  region: process.env.AWS_REGION,
  mezzanineBucket: process.env.mezzanineBucket,
  mediaConvertRole: process.env.mediaConvertRole,
  service: process.env.service,
}

const main = async (params: Steps.ConvertSourceFile): Promise<void> => {
  const { bucket, key, id, duration } = params
  const logger = new LambdaLog()

  logger.info('Params', { params, env: process.env })

  const response = await createJob(
    {
      id,
      bucket,
      key,
      mediaConvertRole: LOCAL_ENV_VARIABLES.mediaConvertRole,
      region: LOCAL_ENV_VARIABLES.region || '',
      mezzanineBucket: LOCAL_ENV_VARIABLES.mezzanineBucket,
      dimensions: params.dimensions,
      duration,
      service: LOCAL_ENV_VARIABLES.service,
    },
    { logger },
  )
  logger.info('response', { response })
}
export const handler = main
