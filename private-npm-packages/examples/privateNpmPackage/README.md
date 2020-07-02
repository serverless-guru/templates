# Starwars api to Card

## Installation
In order to add this package to your service, make sure you are logged in to your npm account. Inside your project folder run the following command:
```
npm i @YOUR_ORG/starwarscard
```

## API
Input:
```js
{ 
    name: String
    height: String  
}
```

Output:
```js
{
    name: String
    height: String
    date: Number
}

```


## Usage
This module will format a person retrieved from the Starwars API into card details .
```js
const getCardDetails = require('@YOUR_ORGg/starwarscard')
const fetch = require('node-fetch')

const main = async () => {
    const res = await fetch('https://swapi.dev/api/people/1')
    const result = await res.json()
    return getCardDetails(result)
}

module.exports = main
```