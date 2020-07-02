'use strict';

// import Sila
const sila = require('sila-sdk/lib/index.js');

module.exports.hello = async (event, context) => {
    sila.checkKYC('', '').then((resolve, reject) => {
      console.log('success');
  }).catch(err => console.log(err));
};
