# base image
FROM lambci/lambda:build-nodejs12.x

WORKDIR /app

RUN npm install serverless -g

COPY package.json /app

RUN npm install

COPY index.js /app

COPY tests/ /app

COPY serverless.yml /app