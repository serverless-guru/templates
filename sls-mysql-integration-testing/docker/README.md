# How to build a docker image for our application

Inside this folder, we have a Dockerfile which gives instructions for building a docker image. 
Take note of the database name and password defined. Also take note of the fact that we prepopulate the database with some data, which will be present everything we spin up our docker database locally.

In order to buld this image, we run the following command:
```
docker build -t projectname-mysql .
```

Now that this image is in our environment, we can start a new instance of it when we start developing, which will allow us to run tests locally that deal with a mysql database.
