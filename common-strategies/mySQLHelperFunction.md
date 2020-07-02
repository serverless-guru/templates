## Wrap MySQL Calls into a Promise

- [Pattern detailing this task](https://github.com/serverless-guru/templates/tree/master/nodejs-callbacksToAsyncAwait)
- Keep in mind all await functions must be inside a async function

Instead of using callbacks:
```jsx
const main = () => {
  connection.query(sqlA, function(err, data) {
    if (err) {
      connection.destroy()
      // error handling
    }
    // ...code
    connection.query(sqlB, function(err, data) {
      if (err) {
        connection.destroy()
        // error handling
      }
      // ...code
      connection.query(sqlC, function(err, data) {
        if (err) {
          connection.destroy()
            // error handling
        }
        // ...code	  
      }
    }
  }
}
```

We can instead wrap MySQL Queries in promises and keep all high level logic and orchestration simple in an async main function
```js
const getDataA = (connection, data) => {
  return new Promise((res, rej) => {
    const sqlA = `...sql command`
    connection.query(sql, function(err, data) {
      if (err) {
        rej(err)
      }
      res(data)
    }
  })
}

const getDataB = (connection, data) => {
  return new Promise((res, rej) => {
    const sqlB = `...sql command`
    connection.query(sql, function(err, data) {
      if (err) {
        rej(err)
      }
      res(data)
    }
  })
}

const getDataC = (connection, data) => {
  return new Promise((res, rej) => {
    const sqlC = `...sql command`
    connection.query(sql, function(err, data) {
      if (err) {
        rej(err)
      }
      res(data)
    }
  })
}

const main = async () => {
  try {
    const resA await getDataA(connection, data)
    const resB await getDataB(connection, data)  
    const resC await getDataC(connection, data)
  } catch(e) {
    connection.destroy()
    // error handling
  }
}
```
