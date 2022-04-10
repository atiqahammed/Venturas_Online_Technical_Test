# Venturas_Online_Technical_Test
This is technical document for running the api and web application.

## Environment requirement
1. node version >= 14.15.4
2. postgresql version >= 12
3. yarn

##Environment setup
1. download the code from main branch

### Creating Database
1. create a database using command line or postgresql dabasebase UI
2. go to api-app folder
    ```
    cd api-app
    ```
3. go to .env file and setup database connections
    ```
    NODE_ENV=development
    PORT=4000
    
    DB_HOST=127.0.0.1
    DB_PORT=5432
    DB_USER=postgres
    DB_PASS=VeryStrongPassword_0
    DB_NAME=employee_db
    
    WEB_REGISTRATION_COMPLETE_URL=http://localhost:3000/complete-registration
    EMAIL_API_KEY=pk_prod_S754PKGGSX47MQNW675SFBS56EDH
    
    MODE=DEV
    RUN_MIGRATIONS=true
    
    JWT_SECRET_KEY=1ab2c3d4e5f61ad8c3d4e5f8
    JWT_TIMEOUT_IN_SECONDS=100000s
    API_KEY=1ab2c3d4e5f61ad8c3d4e5f8
    SESSION_TIMEOUT=100000
    ```
    also set other environment variables.
4. run the following to install packages
    ```
    yarn install
    ```
5. run the following command to setup database tables
    ```
    yarn typeorm:migration:run
    ```
### Set Up api-app
1. go to api-app folder
    ```
    cd api-app
    ```
2. run the following command to build application
    ```
    yarn build
    ```
3. run the following command to start api application
    ```
    yarn nest:dev
    ```
the application will be running on localhost on 4000 port and the swagger UI will be shown in http://localhost:4000/api

### Set up web application
1. got to web-app folder
    ```
    cd web-app
    ```
2. set up .env file 
    ```
    REACT_APP_API_BASE_URL=http://localhost:4000/api/v1
    ```
3. install dependencies 
    ```
    yarn install
    ```
4. start web application
    ```
    yarn start
    ```
the ui application will be visiable at http://localhost:3000