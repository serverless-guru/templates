## Centralize Http Responses into a helper function

### Standardize Error responses such as :

```yaml
{
    statusCode: 500,
    headers: {
        "Access-Control-Allow-Origin": "*",
        "X-Content-Type-Options": "nosniff",
        "X-XSS-Protection": "1;mode=block",
        "Strict-Transport-Security": "max-age=63072000"
    },
    body: JSON.stringify(mainResObject)
}
```

Into a reusable function:

```yaml
const http = {
    serverError: mainResObject => ({
        statusCode: 500,
        headers: {
            "Access-Control-Allow-Origin": "*",
            "X-Content-Type-Options": "nosniff",
            "X-XSS-Protection": "1;mode=block",
            "Strict-Transport-Security": "max-age=63072000"
        },
        body: JSON.stringify(mainResObject)
    })
}
```

And call function on all server errors instead of copying and pasting the response:

```yaml
resolve(http.serverError(mainResObject))
```

### Example Solution

- [Example Helper Function](https://github.com/serverless-guru/templates/blob/master/sls-general/src/helpers/http.js)
- [Example Usage](https://github.com/serverless-guru/templates/blob/master/sls-general/src/handler.js)
