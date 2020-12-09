const secretKey = require('./common/loadSecretKey.js');
const faker = require('faker');

let mysql = null;
let secretKeyValues = null;

module.exports.handler = async (event) => {
  if (!secretKeyValues)
    secretKeyValues = await secretKey.getSecretData();

  if (mysql == null) {
    mysql = require('serverless-mysql')({
      config: {
        host: secretKeyValues.host,
        // USE host as localhost if you are using a ssh tunnel to access the database.
        // host: "localhost",
        database: "sakila",
        user: secretKeyValues.username,
        password: secretKeyValues.password
      }
    });
  }

  const firstName = faker.name.firstName().replace(/[^a-zA-Z ]/g, "")
  const lastName = faker.name.lastName().replace(/[^a-zA-Z ]/g, "")

  if (event.Records) {
    event.Records.forEach(async (record) => {
      await mysql.query(`INSERT INTO actor (first_name, last_name) VALUES ('${firstName}', '${lastName}')`)
    });
  }

  await mysql.end();

  return 'done';
};