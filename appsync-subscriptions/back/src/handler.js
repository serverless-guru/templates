const db = require('./utils/db')

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
  return data
}

const updateToComplete = async data => {
  await db.set({
    ...data,
    status: 'COMPLETE'
  })
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