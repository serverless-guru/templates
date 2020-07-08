# Serverless Webpack - Example Project

## Folder Structure

* core - shared files across services

    * lib/users/helper.js - pulls in from root `node_modules/` and imported from `services/exampleA` service

* services - logical groupings of functionality by domain

    * exampleA - example service with simple Lambda, pulls in `core/` and uses root `node_modules/`

        * core - symlink version of root `core/`

        * src - lambda business logic
    
    * webpack.config.js - serverless-webpack configuration reused by all services

* node_modules - root level `node_modules/` with both dev dependencies and regular dependencies