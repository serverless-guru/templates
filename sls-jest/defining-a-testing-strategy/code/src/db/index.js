const AWS = require('aws-sdk')
const dynamoDb = new AWS.DynamoDB.DocumentClient({
    region: process.env.REGION || 'us-east-1'
})

const getDbName = name => `${process.env.SERVICE}-${name}-${process.env.STAGE}`

module.exports = {
    getPic: async id => {
        const params = {
            TableName: getDbName('pics'),
            Key: {
                PK: id + '#latest'
            }
        }

        try {
            const x = await dynamoDb.get(params).promise()
            return {
                pic: {
                    url: x.Item.url,
                },
                picError: false
            }
        } catch(e) {
            return {
                pic: false,
                picError: 'There was a problem getting the picture'
            }
        }
    },

    getTweet: async id => {
        const params = {
            TableName: getDbName('tweets'),
            Key: {
                PK: id + '#latest'
            }
        }

        try {
            const x = await dynamoDb.get(params).promise()
            return {
                tweet: x.Item.tweet,
                tweetError: false
            }
        } catch(e) {
            return {
                tweet: false,
                tweetError: 'There was a problem getting the tweet'
            }
        }
    },

    saveHighlighted: async data => {
        try {
            const params = {
                TableName: getDbName('highlighted'),
                Item: {
                    PK: 'highlighted',
                    id: data.id,
                    name: data.name,
                    price: data.price,
                    tweet: data.tweet,
                    pic: data.pic
                }
            }

            await dynamoDb.put(params).promise()
            return {
                highlighted: data,
                highlightedError: false
            }
        } catch(e) {
            return {
                highlighted: false,
                highlightedError: 'Could not save highlighted'
            }
        }
    }
}



// module.exports = {
//     getPic: async () => {
//         return {
//             pic: {
//                 url: 'https://google.com'
//             },
//             error: false
//         }
//     },

//     getTweet: async () => {
//         return {
//             tweet: 'lorem ipsum...',
//             error: false
//         }
//     },

//     saveHighlighted: async () => {
//         return {
//             highlighted: {
//                 name: 'Coffee 1',
//                 price: 200,
//                 tweet: 'lorem ipsum...',
//                 pic: 'https://google.com'
//             },
//             highlightedError: false
//         }
//     }
// }