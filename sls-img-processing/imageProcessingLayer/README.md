# Image Processing Layer

This layer can be used for Lambda Functions which need to do any image processing. This
layer contains the following npm modules:
- sharp



### How to use this layer in your Lambda Function

```js
const sharp = require('/opt/node_modules/sharp')

const resizeBarCodeImage = bufferString => {
  return sharp(bufferString)
    .resize(500, 500)
    .toBuffer()
}
```


### Important Note
If your organization uses multiple languages for Lambda, it is advised that you organize your layer with folders representing each language at the root. Example:

```
/nodejs
    /node_modules/aws-xray-sdk
    /node_modules/sharp
/python
    /lib/python3.8/site-packages

```

AWS's recommendations for structuring your lambda layer can be found [here](https://docs.aws.amazon.com/lambda/latest/dg/configuration-layers.html#configuration-layers-path)
