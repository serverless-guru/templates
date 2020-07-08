'use strict';

const axios = require('axios');
const helper = require('../../core/lib/users/helper');

module.exports.hello = async event => {

  console.log('helper', helper.print("ryan"));

  try {
    let res = await axios.get('https://reqres.in/api/users?page=2')
    console.log(res.data);
    return {
      statusCode: 200,
      body: JSON.stringify(
        {
          message: 'Go Serverless v1.0! Your function executed successfully!',
          input: event,
        },
        null,
        2
      )
    };
  } catch (error) {
    console.log(error);
      return {
        statusCode: 500
      };
  }
};
