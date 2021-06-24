# Image Resize
[Cloudfront](https://aws.amazon.com/cloudfront/) and [S3](https://aws.amazon.com/s3/) template for thumbnail generation and caching for [Yapawa](https://github.com/yapawa)

## Concept
S3 Bucket as website holding cached files. When a file is not found, returns 307 towards an API Gateway.

API Gateway will generate the thumbnail and store in the cache bucket for subsequent request and return a 302 with the Cloudfront URL.

## Configuration
Copy *config/dev.sample.yml* and/or *config/production.sample.yml* to *config/dev.yml* and *config/production.yml* respectively.

Edit *config/dev.yml* and *config/production.yml* to suit your needs.

Run `nvm use` to load the right node version and `npm install` to install all the dependencies.

## URL Format
Inspired from [Cloudinary](https://cloudinary.com/documentation/image_transformations#transforming_media_assets_using_dynamic_urls) and [ImageKit](https://docs.imagekit.io/features/image-transformations)
```
https://{domain}/{folder}/{filename}/{version}/{transformations}/{name}.{format}
```
- domain: Cloudfront domain
- folder: The root folder of the photo
- filename: Photo source filename
- version: allows cache busting
- transformations: see [Cloudinary](https://cloudinary.com/documentation/image_transformation_reference)
  - w: width in pixels
  - h: height in pixels
  - c: crop mode
    - scale: Resizes the image to exactly match the width and height, changing the aspect ratio.
    - crop: Resizes and crops the image to width and height. Cropped area depends on gravity. (_default when both dimensions is passed_)
    - fit: Resizes the image to fit inside width and height (_default when only one dimension is passed_).
    - fill: Resizes the image to cover both width and height.
    - pad: Resizes the image to fit inside width and height and add padding to match width and height.
    - cover: Crops the image to width and height. Cropped area depends on gravity.
  - ar: Aspect Ratio. When only one dimension is set, sets the other dimension.
  - g: gravity (default _center_), valid values are: `top`, `right top`, `right`, `right bottom`, `bottom`, `left bottom`, `left`, `left top`, `north`, `northeast`, `east`, `southeast`, `south`, `southwest`, `west`, `northwest`, `center` or `centre`.
  - dpr: Changes image size to match dpr
  - bg: Background color (RGB code) when crop mode is _pad_, default _black_
- name: Photo slug
- format: output format (_jpg, jpeg, png or webp_)

## Deploy
`sls deploy` (development) or `sls -s production deploy`

## Drawbacks
- No auto detection on DPR, client needs to know it's DPR.

    This can be done using Javascript:

    ```javascript
    let dpr = 1
    if (devicePixelRatio) {
      dpr = devicePixelRatio
    } else if (window.devicePixelRatio) {
      dpr = window.devicePixelRatio
    }
    dpr = parseFloat(parseFloat(dpr).toFixed(1))
    ```
- No auto detection on supported formats: client needs to know if he can display webp.

    This can be done using Javascript:

    ```javascript
    let supportsWebp = false
    if (!self.createImageBitmap) {
      supportsWebp = false
    }
    const webpData = 'data:image/webp;base64,UklGRh4AAABXRUJQVlA4TBEAAAAvAAAAAAfQ//73v/+BiOh/AAA='
    return fetch(webpData).then(r => {
      return r.blob().then(blob => {
        return createImageBitmap(blob).then(() => {
          supportsWebp = true
        }, () => {
          supportsWebp = false
        })
      })
    })
    ```
- No normalization for transformations
    - `/w_100,h_100/` and `/w_101,h_100/` will generate different files in S3 and execute lambda twice
    - `/w_100,h_100/` and `/h_100,w_100/` will generate different files in S3 and execute lambda twice

    This can be mitigated by using size names instead of pixels:

      - `/s_medium/` would tell Lambda to generate an image of 128x128
- Works only with clients following redirection
    Not really a problem, your client is a browser, and all of them follow redirection

## Alternatives
### Lambda@Edge based
* [cloudfront-image-proxy](https://github.com/skorfmann/cloudfront-image-proxy/)

### Commercial
* [Cloudinary](https://cloudinary.com/)
* [Imagekit](https://imagekit.io/)

## Where is it used?
This service is used as part of a serverless/static online gallery Yapawa (Yet Another Photo Album Web Application). Learn more at https://yapawa.net/

## Project template
Based on [serverless-template-aws-webpack-nodejs](https://github.com/Spuul/serverless-template-aws-webpack-nodejs/tree/master/)

### File structure
- **events/**
  Store all events related to testing
- **lib/config.js**
  Javascript module to build serverless.yml
- **resources/**
  Contains yml files describing each resource. Definitions can be nested 2 levels deep, in a subfolder describing the AWS resource, like `IamRole/specificServiceRole.yml`.
  The folder name is expected to follow [Serverless convention](https://serverless.com/framework/docs/providers/aws/guide/resources#aws-cloudformation-resource-reference) for naming.
- **services/**
  Contains each individual Lambda function (.js) and it's definitions (.yml).
  In addition to the usual *handler* and *event* definitions, the yml can also hold a specific *resource* definition related to the function, without the need for an entry in the *resources/* folder.
- **stages/**
  Stage specific configurations.

### Logging
[lambda-log](https://www.npmjs.com/package/lambda-log) provides a more structured way of logging:
```javascript
const log = require('lambda-log')
log.info('Log Tag', {key1: value1, key2: value2})
```
Which will result in:
```
{"_logLevel":"info","msg":"Log Tag","key1":"value1","key2":"value2","_tags":["log","info"]}
```
You can also add meta data by default:
```
log.options.meta.fct = 'fctName'
log.options.meta.requestId = event.requestContext.requestId
log.options.meta.path = event.path
log.options.meta.sourceIp = event.requestContext.identity.sourceIp
```
