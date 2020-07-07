const db = require('./utils/db')
const emit = require('./utils/emit')
const subscription = require('./utils/triggerSubscription')


const io = {
  snsInput: e => {
    const snsMessage = e.Records[0].Sns
    return JSON.parse(snsMessage.Message)
  }
}




const listTasks = async event => {
  const res = await db.list({
    PK: 'user_1234',
    SK: 'task_'
  })

  return res.Items
}

const createTask = async data => {
  await db.set({
    ...data,
    status: 'PROCESSING'
  })

  await emit.processStarted({
    ...data,
    status: 'PROCESSING'
  })

  return data
}


const longRunningFunction = async event => {
  const data = io.snsInput(event)

  await db.set({
    ...data,
    status: 'COMPLETE'
  })

  try {
    const x = await subscription.triggerOnComplete(data)
    if (x.errors) {

      console.log(x.errors[0])

    }
    console.log('DONE - ', x)
  } catch (e) {
    console.log('HTTP ERR - ', e)
  }
}

const updateToComplete = async data => {
  return data
}

const route = e => (t, f) =>
  e.info.parentTypeName === t &&
  e.info.fieldName === f

module.exports.main = async event => {
  const is = route(event)

  if (is('Query', 'listTasks')) {
    return await listTasks(event)
  }

  if (is('Mutation', 'createTask')) {
    return await createTask(event.arguments.input)
  }

  if (is('Mutation', 'updateToComplete')) {
    return await updateToComplete(event.arguments.input)
  }
}

module.exports.longRunningFunction = longRunningFunction