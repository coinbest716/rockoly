This project uses [Feathers](http://feathersjs.com). An open source web framework for building modern real-time applications.

## Getting Started

1. Make sure you have [NodeJS](https://nodejs.org/) and [npm](https://www.npmjs.com/) installed.
2. Install your dependencies
    ```
    cd path/to/node-server; npm install
    ```
3. Start your app
    ```
    npm start
    ```

## Config 

Environment based configs are stored in `\config\***` path. 

Local Dev   - `localdev.json` <br>
Development - `development.json`<br>
Production  - `production.json`<br>
Test        - `test.json`<br>

## Run application 

1. Run locally pointing to dev
    ```
    bash ./bin/start.sh localdev
    ```
2. Run in development environment
    ```
    bash ./bin/start.sh dev
    ```
3. Run in staging environment
    ```
    bash ./bin/start.sh test
    ```
4. Run in production environment
    ```
    bash ./bin/start.sh prod
    ```

    When we run the node using above cli, it will run the [Postgraphile](https://www.graphile.org/postgraphile/) first and then [Apollo Graphql](https://www.apollographql.com/docs/apollo-server/getting-started/) server next.
	
	When you run locally, it will run the server in path [localhost](http://localhost:2002/graphql)


## Logs

By default when you run the node app, it will log the consoles in separate file. <br />
1. For Windows : ```c:/temp/node_server.log``` <br />
2. For Linux : ```/var/log/node_server.log``` <br />

## Library:
1. [Feathersjs](https://feathersjs.com/)
2. [Postgraphile](https://www.graphile.org/postgraphile/)
3. [Apollo](https://apollographql.com/docs/apollo-server/)
4. [Firebase-admin](https://github.com/firebase/firebase-admin-node)
5. [Nodemailer](https://nodemailer.com/about/)
6. [Postgraphile-plugin-connection-filter](https://github.com/graphile-contrib/postgraphile-plugin-connection-filter)
7. [Stripe](https://github.com/stripe/stripe-node)
8. [Twilio](https://www.twilio.com/docs/libraries/node)
9. [Postgis](https://postgis.net/)


## Project structure
```
│   Bin 
│   Config   
└───Src 
│   └───subfolder1
│   	└───Db 
│   	└───Firebase 
│   	└───Postgraphile 
│   	└───Services  
│   	└───Shared  
│   	└───Utils  
│   	└───Postgraphile 
```
