
## Description

Cyphor API - Encrypt and Decrypt with key


## Recommended!! Running the app with docker (very simple and easy)


You do not need to setup any database, docker will bootsrap all resources including the backend and database and host them both in a local subnet

```bash
# development
$ docker-compose up

# head to swagger link to see how the api works and play around with all the endpoints available
$ localhost:4000/swagger

# api endpoint itself
$ localhost:4000/ciphor

# (optional) To connect to postgres admin to manager the database 
$ localhost:5050/

Credentials
  - email: admin@admin.com
  - password: password

Database server
  - POSTGRES_HOST=172.26.0.20
  - POSTGRES_USER=postgres
  - POSTGRES_PASSWORD=password
  - POSTGRES_DB=account
```

## Installation (without docker)

```bash
$ npm install
```
## Running the app locally (without docker)

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod

# head to swagger link to see how the api works and all the endpoints available
$ localhost:3000/swagger

# api endpoint itself
$ localhost:3000/cyphor
```

## Test locally

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
