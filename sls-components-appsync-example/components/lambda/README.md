# Lambda Layer for npm dependencies

This Lambda Layer is for the following base level dependencies.

* @dynatrace/oneagent

* aws-xray-sdk

* lokijs

* md5

## Setup

Create .env file

```console
AWS_ACCESS_KEY_ID=XXXX
AWS_SECRET_ACCESS_KEY=XXXX
```

## Install

```console
$ cd src
$ npm install
$ cd ..
```

## Deploy

```console
$ sls deploy --debug
```