# Deploying Static Web App to AWS

#### By: Serverless Guru
#### Author: Ryan Jones
#### Date: 11/23/2018

**Github** - [Static Website Template](https://github.com/serverless-guru/templates/tree/master/serverless/static-website)

**Serverless Plugins Course** - [training.serverlessguru.com](https://training.serverlessguru.com/courses/serverless-plugins)

In this short article I will run you through the usage of a Serverless template that we at Serverless Guru have created to help speed up Web Application Development on AWS.

Setting up a basic website can be time consuming. This template aims to cut that time down dramatically. While also ensuring that you can deploy your web application to multiple stages and regions. Powerful!

The Serverless Framework makes it easy by giving us the ability to leverage a plugin called, Serverless Finch. Serverless Finch allows you to simply modify a property called, `distributionFolder` in the serverless.yml file. This property points to where you production files live (e.g. `dist/` or `src/`).

## Get Started:

**Note:** This is not an introduction to the Serverless Framework, if you are new to Serverless please check out our article, Guide: First Serverless Project. We also have an introduction to the Serverless Framework video course at training.serverlessguru.com.

### Available Commands:

* **Deploy** - `npm run deploy <stage> <region>` (Ex: `npm run deploy dev us-west-1` or `npm run deploy prod us-west-2`)

* **Remove** - `npm run remove <stage> <region>` (Ex: `npm run remove dev us-west-1` or `npm run remove prod us-west-2`)

### Create a Serverless Project using our Custom Template:

We need to create a project then pull the template into our project. If you would like to get more advanced, see the sections below on using this template to deploy Angular and React applications.

```bash
$~: sls create \
--template-url https://github.com/serverless-guru/templates/tree/master/serverless/static-website \
--path blog
$~: cd blog
```

#### Install Dependencies:

When we pull down the custom template we have everything ready to go, but we still need to install the Serverless Finch dependency.

```bash
$blog: npm install
```

#### Deploy Blog to AWS:

Now that we have our project setup with the starter files we are ready to demo a deploy of a website to AWS.

```bash
$blog: npm run deploy dev us-west-1
```

#### Cleanup Website:

There are always two halves to a deployment. One for deploying and one for cleaning up. The command below will cleanup our website.

```bash
$blog: npm run remove dev us-west-1
```

## More Examples

Once you have a basic website deploying using this template then you can expand any direction you choose. For instance, why not build an Angular app or React app?
Use this template to make your web app deployments automated and multi-region/multi-stage!!

### Angular Example:

Building and deploying an Angular app is easy with the Angular CLI in combination with this template.

```bash
# Create Angular app with boilerplate
$~: ng new blog
$~: cd blog

# Build Angular app
$blog: ng build

# Update serverless.yml to point to built Angular app
...
  client:
    ...
    distributionFolder: dist/blog

# Deploy to dev environment
$blog: npm run deploy dev us-west-2
```

### React Example:

Building and deploying a React app is easy with create-react-app in combination with this template.

```bash
# Create React app with boilerplate
$~: npx create-react-app blog

$~: cd blog
```

### Build React app

```bash
$blog: npm run build
# Update serverless.yml to point to built React app
...
  client:
    ...
    distributionFolder: build/

# Deploy to dev environment
$blog: npm run deploy dev us-west-2
```

### Basic Website Example:

Building and deploying a basic website is easy with this template. All you need to do is add your own html, css, and js into the /public directory and everything else will be handled for you.

```bash
# Deploy to dev environment
$static-website: npm run deploy dev us-west-2
```

## Author Information:

### Ryan Jones

Founder & Lead Cloud Developer at [Serverless Guru](https://www.serverlessguru.com)
[ryan@serverlessguru.com](mailto:ryan@serverlessguru.com)

### Social Media

[LinkedIn](https://www.linkedin.com/in/ryanjonesirl), [Twitter](https://www.twitter.com/ryanjonesirl), [Website](https://www.ryanjonesirl.com)