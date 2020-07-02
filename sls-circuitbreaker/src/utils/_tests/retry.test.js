const retry = require('../retry')

class TransientError extends Error {
    constructor(message) {
        super(message)
        this.statusCode = 503
    }
}

class ServerError extends Error {
    constructor(message) {
        super(message)
        this.statusCode = 500
    }
}

class ValidationError extends Error {
    constructor(message) {
        super(message)
        this.statusCode = 400
    }
}

const exponentialBackoffTimes = [
    0,
    0,
    0,
    0
]

describe('retry', () => {
    test('will work', async () => {

        const workingFunction = () => 2
        const result = await retry({
            fn: workingFunction,
            isTransientError: e => e.statusCode === 503,
            isServerError: e => e.statusCode !== 503 && e.statusCode > 499,
            isValidationError: e => e.statusCode > 399 && e.statusCode < 500,
            exponentialBackoffTimes
        })
        expect(result).toEqual({
            state: 'SUCCESS',
            retries: 0,
            data: 2
        })
    })

    test('will show 1 retry if it failes once', async () => {
        const workingFunction = jest.fn()
            .mockImplementationOnce(() => {
                throw new TransientError('TransientError')
            })
            .mockImplementation(() => 2)

        const result = await retry({
            fn: workingFunction,
            isTransientError: e => e.statusCode === 503,
            isServerError: e => e.statusCode !== 503 && e.statusCode > 499,
            isValidationError: e => e.statusCode > 399 && e.statusCode < 500,
            exponentialBackoffTimes
        })
        expect(result).toEqual({
            state: 'SUCCESS',
            retries: 1,
            data: 2
        })
    })

    test('will show 2 retry if it failes twice', async () => {
        const workingFunction = jest.fn()
            .mockImplementationOnce(() => {
                throw new TransientError('TransientError')
            })
            .mockImplementationOnce(() => {
                throw new TransientError('TransientError')
            })
            .mockImplementation(() => 2)

        const result = await retry({
            fn: workingFunction,
            isTransientError: e => e.statusCode === 503,
            isServerError: e => e.statusCode !== 503 && e.statusCode > 499,
            isValidationError: e => e.statusCode > 399 && e.statusCode < 500,
            exponentialBackoffTimes
        })
        expect(result).toEqual({
            state: 'SUCCESS',
            retries: 2,
            data: 2
        })
    })

    test('will show 3 retry if it fails three times', async () => {
        const workingFunction = jest.fn()
            .mockImplementationOnce(() => {
                throw new TransientError('TransientError')
            })
            .mockImplementationOnce(() => {
                throw new TransientError('TransientError')
            })
            .mockImplementationOnce(() => {
                throw new TransientError('TransientError')
            })
            .mockImplementation(() => 2)

        const result = await retry({
            fn: workingFunction,
            isTransientError: e => e.statusCode === 503,
            isServerError: e => e.statusCode !== 503 && e.statusCode > 499,
            isValidationError: e => e.statusCode > 399 && e.statusCode < 500,
            exponentialBackoffTimes
        })
        expect(result).toEqual({
            state: 'SUCCESS',
            retries: 3,
            data: 2
        })
    })

    test('will show 4 retry if it fails four times', async () => {
        const workingFunction = jest.fn()
            .mockImplementationOnce(() => {
                throw new TransientError('TransientError')
            })
            .mockImplementationOnce(() => {
                throw new TransientError('TransientError')
            })
            .mockImplementationOnce(() => {
                throw new TransientError('TransientError')
            })
            .mockImplementationOnce(() => {
                throw new TransientError('TransientError')
            })
            .mockImplementation(() => 2)

        const result = await retry({
            fn: workingFunction,
            isTransientError: e => e.statusCode === 503,
            isServerError: e => e.statusCode !== 503 && e.statusCode > 499,
            isValidationError: e => e.statusCode > 399 && e.statusCode < 500,
            exponentialBackoffTimes
        })
        expect(result).toEqual({
            state: 'SUCCESS',
            retries: 4,
            data: 2
        })
    })

    test('will show 5 retry and fails', async () => {
        const workingFunction = jest.fn()
            .mockImplementationOnce(() => {
                throw new TransientError('TransientError')
            })
            .mockImplementationOnce(() => {
                throw new TransientError('TransientError')
            })
            .mockImplementationOnce(() => {
                throw new TransientError('TransientError')
            })
            .mockImplementationOnce(() => {
                throw new TransientError('TransientError')
            })
            .mockImplementationOnce(() => {
                throw new TransientError('TransientError')
            })
            .mockImplementation(() => 2)

        const result = await retry({
            fn: workingFunction,
            isTransientError: e => e.statusCode === 503,
            isServerError: e => e.statusCode !== 503 && e.statusCode > 499,
            isValidationError: e => e.statusCode > 399 && e.statusCode < 500,
            exponentialBackoffTimes
        })
        expect(result).toEqual({
            state: 'NETWORK_ERROR',
            retries: 5,
            data: false
        })
    })


    test('will return server error with correct retry number', async () => {
        const workingFunction = jest.fn()
            .mockImplementationOnce(() => {
                throw new TransientError('TransientError')
            })
            .mockImplementationOnce(() => {
                throw new TransientError('TransientError')
            })
            .mockImplementationOnce(() => {
                throw new ServerError('ServerError')
            })
            .mockImplementation(() => 2)

        const result = await retry({
            fn: workingFunction,
            isTransientError: e => e.statusCode === 503,
            isServerError: e => e.statusCode !== 503 && e.statusCode > 499,
            isValidationError: e => e.statusCode > 399 && e.statusCode < 500,
            exponentialBackoffTimes
        })
        expect(result).toEqual({
            state: 'SERVER_ERROR',
            retries: 2,
            data: false
        })
    })

    test('will return validation error with correct retry number', async () => {
        const workingFunction = jest.fn()
            .mockImplementationOnce(() => {
                throw new TransientError('TransientError')
            })
            .mockImplementationOnce(() => {
                throw new TransientError('TransientError')
            })
            .mockImplementationOnce(() => {
                throw new ValidationError('TransientError')
            })
            .mockImplementation(() => 2)

        const result = await retry({
            fn: workingFunction,
            isTransientError: e => e.statusCode === 503,
            isServerError: e => e.statusCode !== 503 && e.statusCode > 499,
            isValidationError: e => e.statusCode > 399 && e.statusCode < 500,
            exponentialBackoffTimes
        })
        expect(result).toEqual({
            state: 'VALIDATION_ERROR',
            retries: 2,
            data: false
        })
    })
})