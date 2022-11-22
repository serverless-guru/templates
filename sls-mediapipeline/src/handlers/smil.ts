import type { Steps } from 'local-ts'

import { createSmil } from '@@controllers/smil'
import { LambdaLog } from 'lambda-log'

const LOCAL_ENV_VARIABLES = {
  mezzanineBucket: process.env.mezzanineBucket,
}

const main = async (params: Steps.CreateSmil): Promise<string | void> => {
  const logger = new LambdaLog()
  logger.info('params', { params })

  const smilKey = await createSmil(
    { ...params, bucket: LOCAL_ENV_VARIABLES.mezzanineBucket },
    { logger },
  )
  return smilKey
}

export const handler = main
