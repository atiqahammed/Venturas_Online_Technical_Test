<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo_text.svg" width="320" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/v/@nestjs/core.svg" alt="NPM Version" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/l/@nestjs/core.svg" alt="Package License" /></a>
<a href="https://www.npmjs.com/~nestjscore" target="_blank"><img src="https://img.shields.io/npm/dm/@nestjs/common.svg" alt="NPM Downloads" /></a>
<a href="https://circleci.com/gh/nestjs/nest" target="_blank"><img src="https://img.shields.io/circleci/build/github/nestjs/nest/master" alt="CircleCI" /></a>
<a href="https://coveralls.io/github/nestjs/nest?branch=master" target="_blank"><img src="https://coveralls.io/repos/github/nestjs/nest/badge.svg?branch=master#9" alt="Coverage" /></a>
<a href="https://discord.gg/G7Qnnhy" target="_blank"><img src="https://img.shields.io/badge/discord-online-brightgreen.svg" alt="Discord"/></a>
<a href="https://opencollective.com/nest#backer" target="_blank"><img src="https://opencollective.com/nest/backers/badge.svg" alt="Backers on Open Collective" /></a>
<a href="https://opencollective.com/nest#sponsor" target="_blank"><img src="https://opencollective.com/nest/sponsors/badge.svg" alt="Sponsors on Open Collective" /></a>
  <a href="https://paypal.me/kamilmysliwiec" target="_blank"><img src="https://img.shields.io/badge/Donate-PayPal-ff3f59.svg"/></a>
    <a href="https://opencollective.com/nest#sponsor"  target="_blank"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
  <a href="https://twitter.com/nestframework" target="_blank"><img src="https://img.shields.io/twitter/follow/nestframework.svg?style=social&label=Follow"></a>
</p>
  <!--[![Backers on Open Collective](https://opencollective.com/nest/backers/badge.svg)](https://opencollective.com/nest#backer)
  [![Sponsors on Open Collective](https://opencollective.com/nest/sponsors/badge.svg)](https://opencollective.com/nest#sponsor)-->

# crastonic-nft-api

## Environment Requirements
- Node v14.15.4
- Yarn
- Postgresql
- Ganache

## Steps to run
1. Clone the code
2. add .npmrc with respective values
  ```
    @devotrixinc:registry=https://npm.pkg.github.com
    //npm.pkg.github.com/:_authToken=<_authToken>
    registry=https://registry.npmjs.org/
  ```
3. run 
    ```
    yarn install
    ```
4. Create a database with name NFT_DATABASE
5. Set environment variables in .env file
    ```
    NODE_ENV=development
    PORT=3000
     
    POSTGRES_HOST=127.0.0.1
    POSTGRES_PORT=5432
    POSTGRES_USER=postgres
    POSTGRES_PASSWORD=VeryStrongPassword_0
    POSTGRES_DATABASE=NFT_DATABASE
    MODE=DEV
    RUN_MIGRATIONS=true
     
    NETWORK=ganache
    PRIVATE_KEY=
    PRIVATE_KEY_GANACHE=
    ```
6. Make Sure ormconfig.json, nodemon.json or nodemon-deploy.json has proper value associated with database connection.
8. Built the code with the following command
    ```
    yarn build
    ```
7. Create datbase migration script if any migration script does not exist in src/migration location.
    ```
    yarn typeorm:migration:generate <some name to identify>
    ```
8. Run migration script
    ```
    yarn typeorm:migration:run
    ```
9. Insert a row in tblProject in NFT_DATABASE. The project ID will be used in POST /price api.
10. To run the code run the following command
    ```
    yarn nest:dev
    ```

