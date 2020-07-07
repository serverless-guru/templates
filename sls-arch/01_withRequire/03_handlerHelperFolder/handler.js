const { db, http } = require('./helper')

const { ValidationError } = require('./helpers/errors')

module.exports.main = async event => {
  try {
    const input = JSON.parse(event.body)

    if (!input.id || !input.name) {
      return http.validationError({
        message: 'input is invalid'
      })
    }

    await db.addItem(input)
    return http.success({
      status: 'success'
    })
  } catch (e) {
    return http.serverError(e)
  }
}


module.exports.addCoffeeOrder = async event => {
  const createOrderId = x => 'order_' + Date.now() + '_' + x.name

  try {
    const input = JSON.parse(event.body)

    if (!input.name) {
      return http.validationError({
        message: 'input is invalid'
      })
    }

    await db.addItem({
      ...input,
      id: createOrderId(input)
    })
    return http.success({
      status: 'success'
    })
  } catch (e) {
    return http.serverError(e)
  }
}

module.exports.addInventoryItem = async event => {
  const createInventoryId = x => 'inventory_' + x.name

  try {
    const input = JSON.parse(event.body)

    if (!input.id || !input.name) {
      return http.validationError({
        message: 'input is invalid'
      })
    }

    await db.addItem({
      ...input,
      id: createInventoryId(input)
    })

    return http.success({
      status: 'success'
    })
  } catch (e) {
    return http.serverError(e)
  }
}

