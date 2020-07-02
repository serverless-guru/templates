require('dotenv').config();
const axios = require('axios').default;
const fs = require('fs');

module.exports = {
  joinArrays: function (fromArray, toArray, sorter) {
    let finalArray = toArray;
    fromArray.forEach( forItem => {
      let isDuplucate = false;
      for (var i = 0; i < toArray.length; ++i) {
        if (toArray[i][sorter] === forItem[sorter]) {
          isDuplucate = true;
          break;
        }
      }
      if (!isDuplucate) {
        finalArray.push(forItem);
      }
    })
    return finalArray;
  },

  getParams: async function (profile) {
    const result = await axios.get(
      `https://api.serverless.com/core/tenants/${process.env.SLS_ORG}/deploymentProfiles/${process.env.TARGET_PROFILE}`,
      { headers: { Authorization: `bearer ${process.env.TOKEN}` }}
    );
    return result.data;
  },

  patchParams: async function (requestBody) {
    const result = await axios.patch(
      `https://api.serverless.com/core/tenants/${process.env.SLS_ORG}/deploymentProfiles/${process.env.TARGET_PROFILE}`, 
      requestBody,
      { headers: { Authorization: `bearer ${process.env.TOKEN}` }}
    );
    return result;
  },

  writeParamsToFile: async function ({ fileName, data }) {
    return new Promise((resolve, reject) => {
      fs.writeFile(fileName, data, (err) => {
        if(err) {
          reject(err);
        }
        resolve('file was saved');
      });
    });
  },

  exportParams: async function ({fileName, data}) {
    console.log({fileName, data})
    try {
      if (!fs.existsSync('./backup')){
        fs.mkdirSync('./backup');
      }
      let name = fileName ? `${fileName}-${new Date().toISOString()}` : `backup-${new Date().toISOString()}`;
      await this.writeParamsToFile({fileName: `./backup/${name}.json`, data: JSON.stringify(data, null, 2) });
    } catch (error) {
      console.log('error', error);
    }
  },

  copyParams: async function () {
    // get params for 'Source' profile and 'Target' profile
    const fromParamsObj = await this.getParams(process.env.SOURCE_PROFILE);
    const toParamsObj = await this.getParams(process.env.TARGET_PROFILE);

    // create backup
    await this.exportParams({ fileName: `copyParams-${fromParamsObj.name}`, data: fromParamsObj });
    await this.exportParams({ fileName: `copyParams-${toParamsObj.name}`, data: toParamsObj });

    // join params and safeguards while deleting incoming 'Source' values with duplicate names
    const paramList = this.joinArrays(fromParamsObj.secrets, toParamsObj.secrets, "secretName");
    // PATCH new results to 'Target' profile
    let requestObj = toParamsObj;
    requestObj.secrets = paramList;
    const result = await this.patchParams(requestObj);
    console.log(result.data);
    return result.data;
  },

  readFile: function (filePath) {
    return new Promise((resolve, reject) => {
      fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
          reject(err);
        }
        resolve(data);
      });
    });
  },

  insertParams: async function () {

    try {

      let combinedList = {secrets: []};

      if (process.env.INSERT_FROM_FILE) {
        combinedList = JSON.parse(await this.readFile(process.env.FROM_FILE));
      } else {
        // get params from .env file
        let envFileToInsert = require('dotenv').config({ path: '.env.insert' }).parsed;

        // Modify envFileToInsert with SLS Pro properties
        for(let keyName of Object.keys(envFileToInsert)) {
          combinedList.secrets.push({
            secretName: keyName,
            secretType: 'generic',
            secretProperties: {
              value: envFileToInsert[keyName],
              sensitive: false
            }
          })
        }
      }

      // get existing params from 'Target' profile
      const toParamsObj = await this.getParams(process.env.TARGET_PROFILE);
      // console.log('toParamsObj', JSON.stringify(toParamsObj));

      // create backup
      await this.exportParams({ fileName: `insertParams-${toParamsObj.name}`, data: toParamsObj });

      // join params of 'Target' profile while deleting incoming envFileToInsert values with duplicate names
      const paramList = this.joinArrays(toParamsObj.secrets, combinedList.secrets, "secretName");
      console.log('paramList', paramList);

      // PATCH new results to 'Target' profile
      let requestObj = toParamsObj;
      requestObj.secrets = paramList;
      const result = await this.patchParams(requestObj);
      console.log(result.data);
      return result.data;

    } catch (error) {
      console.log('error', error); 
    }
  },

  deleteParams: async function () {
    // get params for 'Target' profile
    const toParamsObj = await this.getParams(process.env.TARGET_PROFILE);

    // create backup
    await this.exportParams({ fileName: `deleteParams-${toParamsObj.name}`, data: toParamsObj });

    // PATCH new results to 'Target' profile
    let requestObj = { secrets: [] };
    const result = await this.patchParams(requestObj);
    console.log(result.data);
    return result.data;
  },
};

const consoleCommand = {
  insertParams: `node -e 'require("./index").insertParams()'`,
  copyParams: `node -e 'require("./index").copyParams()'`,
  deleteParams: `node -e 'require("./index").deleteParams()'`,
  exportParams: `node -e 'require("./index").exportParams()'`
}