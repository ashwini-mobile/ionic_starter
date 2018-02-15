/**
 * Copyright (C) 2017 TopCoder Inc., All Rights Reserved.
 */

/**
 * the default config
 *
 * @author      TCSCODER
 * @version     1.0
 */


module.exports = {
  LOG_LEVEL: process.env.LOG_LEVEL || 'debug',
  PORT: process.env.PORT || 3000,
  CLIENT_ID: process.env.CLIENT_ID || 'CLIENT_ID',
  CLIENT_SECRET: process.env.CLIENT_SECRET || 'CLIENT_SECRET',

  TOKEN_EXPIRES: 12 * 60 * 60, // 12 hours
  QUERY_MAX_LIMIT: 20, // default pageSize
  API_VERSION: 'api/v1',

  verifyEmailContent: 'Dear %s, Your verify code is %s, Please keep it properly. you can click this url %s to verify it',

  facebook: {
    clientId: process.env.FACEBOOK_APP_ID || '1152311484876368',
    clientSecret: process.env.FACEBOOK_APP_SECRET || '9187507b2eb659951c3f84e44ec3f484',
  },
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID || '916336714639-4joo46o8oacl7b7vk5askgnfcrrd3b5t.apps.googleusercontent.com',
    clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'JS9b1BCJEh2TmJPmefMsFFGH',
  },
  linkedIn: {
    clientId: process.env.LINKEDIN_CLIENT_ID || '86txayugw7c3zu',
    clientSecret: process.env.LINKEDIN_CLIENT_SECRET || 'wMate44trQtSnpDD',
  },
  email: {
    service: 'Gmail',
    auth: {
      user: 'yourusername@gmail.com',
      pass: 'yourpassword!!',
    },
    debug: true, // include SMTP traffic in the logs
  },
  db: {
    // the uri format is mysql://username:password@host:port/dbname
    uri: process.env.MYSQL_URI || 'mysql://root:@localhost:3306/mjolnir',
    options: {
      dialect: 'mysql',
      pool: {
        max: 5,
        min: 0,
        idle: 10000,
      },
    },
  },
};
