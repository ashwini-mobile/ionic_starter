# MJOLNIR PROJECT CHALLENGE - NODE.JS BACKEND ASSEMBLY CHALLENGE #1

## Install software

- node 8.2.0
- npm 5.x
- mysql 5.7.17

## Local deployment

first, you need startup mysql and create mysql database named *mjolnir* with utf-8 , modify *db.uri* in *config/default.js* for your db uri , like *mysql://username:password@localhost:3306/mjolnir*.

1. open terminal to project root dir ,Install node dependencies using `npm install`
2. check code with `npm run lint`
3. enable it https://myaccount.google.com/lesssecureapps , and open *config/default.js* , enter your gmail **user and pass** at *email.auth*.
4. create random test data run `npm run testdata`, **it will drop all tables and create tables.**
5. run server `npm run start`, **it will auto create all tables if tables not exist.**


## Test

### passport endpoint

open chrome or other browsers, enter urls to test passport url.

- http://localhost:3000/api/v1/auth/google
- http://localhost:3000/api/v1/auth/facebook
- http://localhost:3000/api/v1/auth/linkedIn

### api endpoints

1. open postman 
2. import *docs/mjolnir-backend.postman_collection.json* , *docs/mjolnir-env.postman_environment.json*.
3. test data create 10 users , use username `email0@email.com` - `email9@email.com` and password `123456` to login, when login succeed ,the token will be injected to postman env.
4. test api endpoints.



# Configuration

| key                   | system Environment name | description                              |
| --------------------- | ----------------------- | ---------------------------------------- |
| PORT                  | PORT                    | the server port                          |
| CLIENT_ID             | CLIENT_ID               | the jwt client id                        |
| CLIENT_SECRET         | CLIENT_SECRET           | the jwt client secret                    |
| facebook.clientId     | FACEBOOK_APP_ID         | the facebook app id                      |
| facebook.clientSecret | FACEBOOK_APP_SECRET     | the facebook app secret , used for facebook auth |
| google.clientId       | GOOGLE_CLIENT_ID        | the google client id                     |
| google.clientSecret   | GOOGLE_CLIENT_SECRET    | the google client secret , used for google auth |
| linkedIn.clientId     | LINKEDIN_CLIENT_ID      | the linkedIn client id                   |
| linkedIn.clientSecret | LINKEDIN_CLIENT_SECRET  | the linkedIn client secret, used for linkedIn auth |
| email                 |                         | the email config used for nodermail , default use gmail , you need update user and pass. |
| db.uri                | MYSQL_URI               | the mysql connect uri , for example "mysql://root:@localhost:3306/mjolnir" |





## Get auth and email config values

### auth

the most auth clientId and clientSecret need create app,**the current configuration is already working** , but we still need known how to get new clientId and clientSecre. **note that the http://localhost:3000 only for local deployment.**

- google
  1. goto https://console.developers.google.com, and login.
  2. create new project, and goto the project dashboard.
  3. click *Credentials* on page left , create Credential with Oauth Client Id. now you can see clientId and clientSecre.
  4. click *Library* on page left , and then enable *Google+ Api*.
- facebook
  1. goto https://developers.facebook.com/ , and login it.
  2. create a new app.
  3. goto app dashboard , you can see the appId and appSecret, those values are clientId and clientSecre.
  4. in dashboard , click Facebook Login -> Settings , add *http://localhost:3000/api/v1/auth/facebook/callback* to *Valid OAuth redirect URIs*.
- linkedIn
  1. goto https://www.linkedin.com/developer/apps#, and login it.
  2. create new app , you can see clientId and clientSecret.
  3. enable "r_emailaddress", and add *http://localhost:3000/api/v1/auth/linkedIn/callback* to Oauto 2.0 urls.

### email

- enable it https://myaccount.google.com/lesssecureapps 
- update config values.



# Modification

- modify user type(string) -> types(array) ,  https://apps.topcoder.com/forums/?module=Thread&threadID=903977&start=0
- all search or list endpoint added paging support . https://apps.topcoder.com/forums/?module=Thread&threadID=904021&start=0
- use Time instead of HoursAndMinutes.  https://apps.topcoder.com/forums/?module=Thread&threadID=903989&start=0
- add accessToken to User model, and return it in login endpoint. https://apps.topcoder.com/forums/?module=Thread&threadID=903969&start=0
- use employerProfileId in Schema and OfficeManager . https://apps.topcoder.com/forums/?module=Thread&threadID=904045&start=0
- add 409 to login endpoint , mean email or password error.
- add startDate and endDate in EmploymentRecord.
- modify profile search filter answers to simple struct , [{questionId:10,matchingAnswerOptions:[1,2,3]}] , and the db schema change to answers.
- etc ...



## Notes

- the endpoints in employeeProfiles and employeeSearchFilter don't add negative scenarios, because it's same as employer endpoints.
- the swagger document is updated synchronously, but tcuml file didn't (two much content).



this challenge have a lot of details, please review carefully. for example

- user types should changed if create profile or delete profile.
- the put body in update profile endpoints, if entity have id it should be use exist entity , otherwise create new.
- create employer profile , the employeeOrganization will need support root tree. 
- use endpoint profile search filter, (distance and closeTo filter,answers, paging support , etc..)
- etc ...

#Video
01 - https://youtu.be/VpQrEElQp1Q

02 -[https://youtu.be/VFE6JjSUtlY](https://youtu.be/VFE6JjSUtlY)