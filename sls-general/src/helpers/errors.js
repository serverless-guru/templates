class ValidationError extends Error {
    constructor(message) {
        super(message)
        this.type = 'validation'
    }
}

class DatabaseError extends Error {
    constructor(message) {
        super(message)
        this.type = 'database'
    }
}

class ExternalApiError extends Error {
    constructor(message) {
        super(message)
        this.type = 'external-api'
    }
}

module.exports = {
    ValidationError,
    DatabaseError,
    ExternalApiError
}