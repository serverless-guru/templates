#!/usr/bin/env node

import * as cdk from '@aws-cdk/core';
import { CdkLambdaDeploymentStack } from '../lib/cdk-lambda-deployment-stack.js';

const app = new cdk.App();
new CdkLambdaDeploymentStack(app, 'CdkLambdaDeploymentStack');
