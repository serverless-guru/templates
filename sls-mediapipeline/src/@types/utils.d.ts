declare module 'utils-ts' {
  import type { LambdaLog } from 'lambda-log'

  namespace Utils {
    interface Context {
      logger: LambdaLog
    }
  }
}
