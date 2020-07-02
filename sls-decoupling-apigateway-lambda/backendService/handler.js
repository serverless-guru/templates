const db = require('./utils/db')
const externalService = require('./utils/externalService')
const emit = require('./utils/emit')
const { v4: uuid } = require('uuid')

const http = {
  success: x => {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: JSON.stringify(x),
    }
  },

  validationError: x => {
    return {
      statusCode: 400,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: JSON.stringify({
        message: x
      }),
    }
  },

  serverError: x => {
    return {
      statusCode: 500,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,PUT,POST,DELETE',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: JSON.stringify({
        message: x
      }),
    }
  }
}

const io = {
  snsInput: e => {
    const snsMessage = e.Records[0].Sns
    return JSON.parse(snsMessage.Message)
  },

  apiGatewayInput: e => {
    return JSON.parse(e.body)
  }
}



module.exports.start = async event => {
  let state = {
    writtenToDb: false,
    emittedEvent: false,
    pollId: uuid()
  }

  try {
    const data = io.apiGatewayInput(event)
    if (!data.userId) {
      return http.validationError({
        message: 'input needs userId'
      })
    }

    await db.set({
      userId: data.userId,
      pollId: state.pollId,
      status: 'PENDING',
      details: ''
    })

    state.writtenToDb = true

    await emit.postRequested({
      userId: data.userId,
      pollId: state.pollId
    })

    state.emittedEvent = true

    return http.success({
      status: 'posted',
      pollId: pollId
    })
  } catch (e) {
    // rollback
    if (state.writtenToDb && !state.emittedEvent) {
      await db.remove({
        userId: data.userId,
        pollId: state.pollId
      })
    }
    return http.serverError(e)
  }
}


module.exports.poll = async event => {
  try {
    const input = io.apiGatewayInput(event)
    if (!input.userId) {
      return http.validationError({
        message: 'input needs userId'
      })
    }

    if (!input.pollId) {
      return http.validationError({
        message: 'input needs pollId'
      })
    }

    const data = await db.get(input)

    const notFound = typeof data === 'object' && Object.keys(data).length === 0
    if (notFound) {
      return http.serverError({
        message: 'Not found'
      })
    }

    return http.success({
      status: data.Item.status,
      data: data.Item.details
    })
  } catch (e) {
    return http.serverError(e)
  }
}

module.exports.postPaymentDetails = async event => {
  const data = io.snsInput(event)

  try {
    const externalResult = await externalService.postDataToExternalService(
      data.userId,
      data.pollId
    )

    // Random error for demonstration
    if (Math.random() > .6) {
      throw new Error('Something went wrong!')
    }

    await db.set({
      userId: data.userId,
      pollId: data.pollId,
      status: 'COMPLETE',
      details: externalResult.details
    })

  } catch (e) {
    await db.set({
      userId: data.userId,
      pollId: data.pollId,
      status: 'ERROR',
      details: e.message
    })
  }
}
