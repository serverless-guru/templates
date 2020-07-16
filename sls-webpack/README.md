# Serverless Webpack - Example Project

## Purpose

Reduce the size of your lambda package sizes.

## Steps

### Install

```bash
npm i --save-dev serverless-webpack webpack
```

### Update serverless.yml file in plugins section

```yaml
provider:
    name: aws
    ...
plugins:
    - serverless-webpack
```

### Create webpack.config.js file

```js
const slsw = require('serverless-webpack');
module.exports = {
  target: 'node',
  entry: slsw.lib.entries,
  mode: slsw.lib.webpack.isLocal ? 'development' : 'production',
  node: false,
  optimization: {
    minimize: false,
  },
  devtool: 'inline-cheap-module-source-map',
};
```

### Package

```bash
sls package
```

### Review .zip file, it should be much smaller

### Additional Optimization, add package: individually: true

```yaml
provider:
    name: aws
    ...
package:
    individually: true
plugins:
    - serverless-webpack
```

## Warning

Trying to use `include/exclude` pattern will no longer work. You can't do this when using `serverless-webpack` plugin.

```yaml
package:
    include:
        - file
    exclude:
        - file
```

If you need to bundle any other files that `serverless-webpack` doesn't automatically pick up you will need to do that in the `webpack.config.js` file.