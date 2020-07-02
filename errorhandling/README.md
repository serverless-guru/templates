# General Questions about Error Handling

## 1. Throw Errors or Return Error Objects?

Short Answer: Prefer throwing errors

Discussion on topic: [Link](https://nedbatchelder.com/text/exceptions-vs-status.html)

## 2. Is it ok to throw errors and not catch them directly in the next layer?

Short Answer: Yes

Example:
```js
// Custom Errors
class ValidationError extends Error {
  constructor(message) {
    super(message)
    this.type = 'validation'
  }
}

// DB calls, all of which can throw errors
const getUser = async (data) => {
  const res = await db.get({
    TableName: 'exampleTable',
    Keys: data
  }).promise()
  return res.Item
}

const createProduct = async (data) => {
  return db.put({
    TableName: 'exampleTable',
    Item: data
  }).promise()
}

// Validation, which can throw errors
const validate = async x => {
  if (!x) {
    throw new ValidationError('Input is incorrect')
  }

  if (!x.userId) {
    throw new ValidationError('Input is incorrect')
  }

  // Notice this is a db call, which has the potential to throw an error
  // but we are not catching and handling that error here,
  // we are letting it go past this layer and be caught at the root try catch
  const user = await getUser(x) 

  if (user.storeId !== x.storeId) {
    throw new ValidationError('Not Authorized')
  }
}

module.exports = async data => {
  try {
    await validate(data)
    await createProduct(data)
	
    return {
      statusCode: 200,
      data: JSON.stringify(data)
    }
  } catch (e) {
    return {
      statusCode: e.type === 'validation' ? 400 : 500,
      data: JSON.stringify({
        message: e.message
      })
    }
  }
}

```

### Error handling project example

An example of error handling in a serverless project can be found [here](https://github.com/serverless-guru/templates/tree/master/sls-general/src)

## 3. Should we centralize our error handling at the root try catch?

Short Answer: If possible, Yes.

Description: If something goes wrong, we can:

- try again
- handle the error by catching it right away and executing code within the catch statement
- throw an error and let a different layer handle the error and execute a different path in our code

You should only catch an error if you can properly handle it, otherwise let another spot in your code that is more well equipped to handle the error catch it. For a Request Response triggered Lambda Function, the common way to handle errors is to return a 400 or 500 error. The logic for how a lambda function responds is usually located at the root of the code in the root try catch.

Often, the root try catch will be handling of the errors, but there may be times we need to catch and handle the error immediately . A good example is a function which creates items in a database twice. It is possible for the second call to fail, leaving the db in an invalid state. A solution for this scenario is to wrap the second create method in a try catch. Inside the catch, we will remove the item created in the first call before throwing the error to the root try catch and respond with a 500 error

```js
const createProduct = async (data) => {
  return db.put({
    TableName: 'exampleTable',
    Item: data
  }).promise()
}

const createMetaData = async (data) => {
  return db.put({
    TableName: 'exampleTable',
    Item: {
      ...data,
      SK: 'metadata'
    }
  }).promise()
}

const removeProduct = async (data) => {
  return db.remove({
    TableName: 'exampleTable',
    Keys: data
  }).promise()
}

module.exports = async data => {
  try {
    await createProduct(data)
		
    // if this fails, we need to clean up our db from the first
    // createProduct db call by removing the product. This branch of code
    // should only run if createProduct was successful but createMetaData
    // was not
    try {
      await createMetaData(data)
    } catch(e) {
      await removeProduct(data)
      throw new Error(e)
    }
	
    return {
      statusCode: 200,
      data: JSON.stringify(data)
    }
  } catch (e) {
    return {
      statusCode: 500,
      data: JSON.stringify({
        message: e.message
      })
    }
  }
}
```


## 4. Should we use custom errors

Short Answer: Yes

Description: Custom errors help make your code more readable, and can help make try catch logic simple to manage

```js
// Custom Errors
class ValidationError extends Error {
  constructor(message) {
    super(message)
    this.type = 'validation'
    this.code = A23
    this.statusCode = 400
  }
}

class AuthenticationError extends Error {
  constructor(message) {
    super(message)
    this.type = 'validation'
    this.code = A25
    this.statusCode = 401
  }
}

class DatabaseError extends Error {
  constructor(message) {
    super(message)
    this.type = 'database'
    this.code = B25
    this.statusCode = 500
  }
}

class ExternalServiceAError extends Error {
  constructor(message) {
    super(message)
    this.type = 'api'
    this.code = B26
    this.statusCode = 500
  }
}

modue.exports = async () => {
  try {
    // ... lots of code which throws well named errors
  } catch (e) {
    return {
      statusCode: 500,
      data: JSON.stringify({
        message: e.message,
        code: e.code
      })
    }
  }
}

```

