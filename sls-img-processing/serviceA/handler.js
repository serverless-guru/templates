const sharp = require('/opt/node_modules/sharp')
const bwipjs = require('bwip-js')
const AWS = require('aws-sdk')
const s3 = new AWS.S3()



/**
 * HTTP Helper Function
 * 
 */
const http = {
  success: x => ({
    statusCode: 200,
    body: JSON.stringify(x)
  }),

  serverError: x => ({
    statusCode: 500,
    body: JSON.stringify(x)
  })
}



/**
 * MakeBarCode
 * 
 * The first step in this workflow is to first make a barcode.
 * This will return a Buffer String
 * 
 */
const makeBarCodeImage = () => {
  const text = 'https://serverlessguru.com'
  return new Promise((res, rej) => {
    bwipjs.toBuffer({
      bcid: 'azteccode',
      text,
      scale: 2.5,
      height: 40,
      width: 40,
      includetext: true,
      textxalign: 'center',
    }, function (err, aztecText) {
      if (err) {
        rej(err)
      }
      res(aztecText)
    })
  })
}



/**
 * ResizeBarcodeImage 
 *
 * This function will take a bufferString generated from 
 * the makeBarCodeImage and resize it
 * 
 */
const resizeBarCodeImage = bufferString => {
  return sharp(bufferString)
    .resize(500, 500)
    .toBuffer()
}



/**
 * SaveImageToS3
 *
 * This function will take a bufferString and save it to
 * a S3 bucket as a png with the name testing.png
 *
 */
const saveImageToS3 = async bufferString => {
  const params = {
    Bucket: 'YOUR_BUCKET',
    Key: 'testing.png',
    Body: bufferString,
    ACL: 'public-read',
    ContentType: `png`
  }

  const res = await s3.upload(params).promise()
  return res.Location
}




module.exports.handler = async () => {
  try {
    const image = await makeBarCodeImage()
    const resizedImage = await resizeBarCodeImage(image)
    const imageLocation = await saveImageToS3(resizedImage)

    return http.success({
      location: imageLocation
    })
  } catch (e) {
    return http.serverError({
      status: 'error',
      message: e.message
    })
  }
}