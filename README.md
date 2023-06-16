# typeorm-server
API Server using TypeOrm. TypeScript With JWT authentication.
RealLife skeleton for pure TypeScript server.
### features
validation schema (Joi Based)
authentication & roles (JWT Based)
SPS - Search, Paging & Sorting CRUD generic functions (Original)

## install
npm install

## run
npm run dev

## db
include migrations:
 $ npm run typeorm:create-migration --name=migration_name
 $ npm run typeorm:run-migrations
 ... (on package.js)

 ## using:
 express, axios, jsonwebtoken, chai, joi, mocha

 updated to typeorm v0.3.16
 works with many databases.
 tested with postgresql.


