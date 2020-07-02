#!/bin/bash

cd serviceA && npm i && npm test && cd ../
cd serviceB && npm i && npm test && cd ../
npm i
npm test