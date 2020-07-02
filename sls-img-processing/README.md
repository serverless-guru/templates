# Image Processing Layer Pattern

- [Video Walkthrough](https://www.loom.com/share/516190833982468dba2c62444d3adcaf)


## Description

This pattern uses an npm module called sharp which, when npm installed, produces binaries for the OS
it is being installed on. This means that if we install this in a MACOSX environment, this module will
only work when run on a MACOSX environment, and will not work on AWS Lambda. 

To solve this, we create a Lambda Layer and install the npm modules in the following way:
```
npm install --arch=x64 --platform=linux sharp
```

This npm install is targeting the AWS Lambda environment rather than the MACOSC environment. We can create 
these modules once, store them in our git repository, and deploy them in our bitbucket pipeline without having
to run npm install in our pipeline.