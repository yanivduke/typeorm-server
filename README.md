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


# API
## Auth
### /api/auth/register
METHOD: Post
Create a new user.
#### example
import axios from "axios";

const options = {
  method: 'POST',
  url: 'http://localhost:3101/api/auth/register',
  headers: {'Content-Type': 'application/json'},
  data: {email: 'yaniv@test2.com', password: '1234'}
};

axios.request(options).then(function (response) {
  console.log(response.data);
}).catch(function (error) {
  console.error(error);
});
#### answer
{
	"status": "Exists"/"OK"/"DBError"
}

### /api/auth/login
METHOD: Post
#### example
import axios from "axios";

const options = {
  method: 'POST',
  url: 'http://localhost:3101/api/auth/login',
  headers: {'Content-Type': 'application/json'},
  data: {email: 'yaniv@test.com', password: '1234'}
};

axios.request(options).then(function (response) {
  console.log(response.data);
}).catch(function (error) {
  console.error(error);
});

#### answer
{
	"status": "OK",
	"token": "SFGFGSFeyJhdXRoSZZZZZZZZZZZZZZZZZZZZ1QwMzZZZZZZZZZZZZZZZZZ1QwMzZZZZZZZZZZZZZZZZZ1QwMzZZZZZZZZZZZZZZZZZ1QwMzZZZZZZZZZZZZZZZZZ1QwMzZZZZZZZZZZZZZZZZZ1QwMzZZZZZZZZZZZZZZZZZ1QwMzZZZZZZZZZZZZZZZZZ1QwMz"
}


### /api/auth/reset
METHOD: Put
Send reset request (OTP) --> trigger for reset password email.
Generated email includes a uniq link like:
https://moveo.chita.co.il/reset/?token=647383

#### example
const options = {
  method: 'Put',
  url: 'http://localhost:3101/api/auth/reset/:email',
  headers: {'Content-Type': 'application/json'},
};
...

### /api/auth/update
METHOD: Put
Update user password by validate token from reset email uniq link, to email resetPasswordToken.
* resetPasswordToken expires after 20 minutes 
#### example
const options = {
  method: 'PUT',
  url: 'http://localhost:3101/api/auth/update/:token',
  headers: {'Content-Type': 'application/json'},
  data: {email: 'yaniv@test.com', password: '1234'}
};

## Link

### /api/link/
METHOD: Post
Create new link.
#### example
import axios from'axios';

const options = {
  method: 'POST',
  url: 'http://localhost:3101/api/link/',
  headers: {
    'Content-Type': 'application/json',
    Authorization: 'bearer SFGFGSFeyJhdXRoSZZZZZZZZZZZZZZZZZZZZ1QwMzZZZZZZZZZZZZZZZZZ1QwMzZZZZZZZZZZZZZZZZZ1QwMzZZZZZZZZZZZZZZZZZ1QwMzZZZZZZZZZZZZZZZZZ1QwMzZZZZZZZZZZZZZZZZZ1QwMzZZZZZZZZZZZZZZZZZ1QwMzZZZZZZZZZZZZZZZZZ1QwMz'
  },
  data: '{
 'name':'‫הבית‬ ‫עד‬ ‫ארצי‬ ‫פנים‬', 
 'desc':'‫אמט‬ ‫סיט‬ ‫דולור‬ ‫איפסום‬ ‫לורם‬', 
 'link':'https://cheetah-base-link/?param1=true&param2=false','cdate':'2023-05-19', 
 'status': true, 
 'features': [
      {
      'name':'‫כתובת‬ ‫עדכון‬', 
       'order': 1 
      }, 
      { 
       'name':'‫לדלת‬ ‫מחוץ‬ ‫השארה‬', 
       'order': 2 
      }, 
      { 
       'name':'‫ותשובות‬ ‫שאלות‬', 
       'order': 3 
      } 
  ]
};

axios.request(options).then(function (response) {
  console.log(response.data);
}).catch(function (error) {
  console.error(error);
});
### /api/link/
METHOD: Put
Updates link name and description

### /api/link/status
METHOD: Put
update link status
### /api/link/
METHOD: Get
Get history data
with paging
