const http = require('./helpers/http')
const io = require('./io')
const { ValidationError } = require('./helpers/errors')

/**
 * Validation
 * 
 * It is important to always validate input that comes into a lambda function. Its 
 * easiest to do all validation (or as much as possible) at the beginning, and to 
 * avoid making any IO calls to external services until we confirm this function
 * has everything it needs from the user.
 * 
 * If we need to validate a lot of fields, it may be useful to put validation in its own
 * file.
 */
const validate = (event) => {
  if (!event.body) {
    throw new ValidationError('Body is not defined')
  }

  const input = JSON.parse(event.body)
  if (!input.id) {
    throw new ValidationError('Id is not defined')
  }

  return input
}


/**
 * The following 2 functions simply call IO helper functions, format that data
 * as needed and returns it to the main function. Seperating data fetching from 
 * business logic is a nice way to seperate concerns. Sometimes this is not
 * possible, but should always be our default approach. This insures that 
 * updates to our IO happen in one place, and updates to our business logic
 * happen in another. IO and Business logic tend to change at different rates.
 */
const getAvailableSeating = async (id) => {
  const result = await io.api.getAvailableSeating(id)

  return {
    availableSeating: result,
    totalNumber: result.length
  }
}

const getTodaysTotalDiscount = async () => {
  const discounts = await io.db.findDiscountsByDate()
  const total = discounts.reduce((acc, x) => {
    acc = acc + x.discount
    return acc
  }, 0)

  return total
}


/**
 * ApplyDiscountToEligibleSeats
 * 
 * This is where our business logic is defined. Notice that it is just business logic,
 * it does not have any IO, AWS SDK, or any implementation code here. We have taken 
 * care of all those details somewhere else. This makes updating business logic very
 * simple.
 * 
 * In this case, if there is any updates to how discounts, priority or urgency is defined,
 * we only need to change one function.
 */
const applyDiscountToEligibleSeats = (seating, discount) => {
  const seatsWithDiscounts = seating.availableSeating.map(x => ({
    id: x.id,
    date: x.date,
    discount: x.windowSeat ? 0 : discount,
    priority: x.firstClass + x.cancelled,
    isUrgent: seating.totalNumber < 5
  }))

  return {
    availableSeating: seatsWithDiscounts
  }
}


/**
 * Main Handler Function
 * 
 * Notice the size of this function. It is very small, and it should stay small,
 * even as the features or amount of work this endpoint performs grows. We want this function
 * to act as a summary, or a high level view of what is going on. Instead of doing
 * any low level code, we see at a high level what steps are being performed. Another
 * way of thinking about this function is as a table of contents, and the individual
 * functions it calls are where all the content lives.
 * 
 * 
 * Note about error handling:
 * The best way to handle errors depends on context. Below demonstrates one strategy
 * to centralize error responses and decision making in one place.
 */
exports.handler = async (event) => {
  try {
    const input = validate(event)
    const seating = await getAvailableSeating(input.id)
    const discounts = await getTodaysTotalDiscount()
    const result = applyDiscountToEligibleSeats(seating, discounts)

    return http.success(result)
  } catch (e) {
    if (e.type === 'validation') {
      return http.validationError(e.message)
    }

    if (['database', 'external-api'].includes(e.type)) {
      return http.serverError(e.message)
    }

    return http.serverError('There is a problem on our end, we are on it!')
  }
}
