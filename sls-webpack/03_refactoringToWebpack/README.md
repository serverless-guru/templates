# Refactoring to Webpack

- [Walkthrough Video](https://www.loom.com/share/3b32f103e0314f3d9485b851919ece8e)

# Which tool does the best job
The following tools:
- webpack
- npm modules
- Lambda Layers

Are tools that are often used to solve 2 different problems:
- Code Reuse (time and maintainability optimization)
- Lambda Function Artifact Size (technical optimization)


## When to use Webpack
In this pattern we are using webpack to solve the problem of npm module size. Optimizing the size of npm modules
is something we suggest you always do. This removes the need to have individual `package.json` files in handler
folders and managing npm modules per function. This also makes referencing util and helper files outside of the
handler folder much easier

## When to use Private NPM Modules
NPM modules are great for sharing utils and reusable business logic in your organization. Some important notes about NPM modules
- You can include as many as you like in a package.json file
- The code in an NPM modules is included when packaging your Lambda Function Artifact

## When to use Lambda Layers
Lambda Layers are another way to include already written code for your Lambda Function. The difference here is:
- You can only have 5 per Lambda Function
- Code included in the Lambda Layer is not included in your Lambda Function Artifact

Because you have a limited number of Layers to use, and because they enable your function to be deployed without code
contained in the Layer, Layers are great for very large amounts of code. Some good use cases:

- Swift Runtime Layer (make a Lambda Layer with a Swift runtime so you can write Lambda Functions with Swift)
- Image Processing Layer (sharp is a very large npm module. Making a general Image Processing layer for dependencies like
  these is a great way to keep Lambda Functions light)
- Monitoring Layer (Dynatrace is another example of a heavy npm module)

(It should be noted that webpack often solves the npm module size issue by optimizing what gets packaged. We recommend using webpack first before reaching
for Lambda Layers to solve this issue. Lambda Layers are a good solution when your code must use all of the very large NPM module)

### Summary
- Webpack is something we always recommend
- NPM modules are great for sharing reusable business logic or utils among many services
- Lambda Layers is great when both Webpack and NPM Modules do not solve your problem. This is rare, but is the case when you are working with binaries or very large wrapper agents such as Dynatrace which are not used as normal NPM modules
