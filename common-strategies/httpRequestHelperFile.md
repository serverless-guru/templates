## Make Http Requests into a simplified helper file

Why?

You can simplify the `request.get` syntax a lot more if you create a helper file which uses async/await

Before:

```js
const request = require('request')

const main function = (event, ctx, cb) => {
  request.get({ headers, url: url, body: body
  }, (error, response, body) => {
    if (error) {
      // handle error
      cb('error)
    } else {
      // handle success
      // logic for stepA...
      
      request.get({ headers, url: url, body: body
      }, (error, response, body) => {
        if (error) {
          // handle error
          cb('error)
        } else {
          // handle success
          // logic for stepB...
          
          request.get({ headers, url: url, body: body
          }, (error, response, body) => {
            if (error) {
              // handle error
              cb('error)
            } else {
              // handle success
              // logic for stepC...
              
              cb('success')
            }
          })
        }
      })
    }
  })
}
```

After:

```js
const request = require('request')

const getRequest = (params) => {
  return new Promise((resolve, reject) => {
    request.get(params, (err, res, body) => {
      if(err) {
        reject(err)
      } else {
        resolve(body)
      }
    })
  })
}

exports.handler = async () => {
  try {
    const stepA = await getRequest(params)
    // logic for stepA...
    
    const stepB = await getRequest(params)
    // logic for stepB...
    
    const stepC = await getRequest(params)
    // logic for stepC...
    
    return stepC
  } catch(e) {
    return 'error'
  }
}
```
