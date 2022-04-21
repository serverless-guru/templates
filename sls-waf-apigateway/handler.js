'use strict';

module.exports.todolist = async (event) => {
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: 'WAF protected API Call Response!'
      },
      null,
      2
    ),
  };
};
