const exponentialBackoffTimes = [
    0,
    300,
    1000,
    3000
]

const exponentialBackoff = async (config, retries) => {
    const backoffTimes = config.exponentialBackoffTimes || exponentialBackoffTimes

    return new Promise((res) => {
        setTimeout(async () => {
            try {
                const result = await config.fn()
                res({ result, retries, state: 'SUCCESS' })
            } catch (e) {
                const transientError = config.isTransientError(e)
                const serverError = config.isServerError(e)
                const validationError = config.isValidationError(e)
                const isEligableForRetry = retries < exponentialBackoffTimes.length

                if (transientError && isEligableForRetry) {
                    res(await exponentialBackoff(config, retries + 1))
                }

                if (transientError && !isEligableForRetry) {
                    res({ result: false, retries: retries + 1, state: 'NETWORK_ERROR' })
                }

                if (serverError) {
                    res({ result: false, retries, state: 'SERVER_ERROR' })
                }

                if (validationError) {
                    res({ result: false, retries, state: 'VALIDATION_ERROR' })
                }
            }
        }, backoffTimes[retries])
    })

}

module.exports = async ({ fn, isTransientError, isValidationError, isServerError, exponentialBackoffTimes = false }) => {
    const { result, retries, state } = await exponentialBackoff({
        fn,
        isTransientError,
        isValidationError,
        isServerError,
        exponentialBackoffTimes
    }, 0)
    return {
        state,
        retries,
        data: result
    }
}