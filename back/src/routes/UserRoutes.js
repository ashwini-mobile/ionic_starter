/**
 * Copyright (C) 2017 TopCoder Inc., All Rights Reserved.
 */

/**
 * the User Routes
 *
 * @author      TCSCODER
 * @version     1.0
 */

const Auth = require('../common/Auth');

module.exports = {
  '/login': {
    post: {
      controller: 'UserController',
      method: 'login',
    },
  },
  '/logout': {
    post: {
      controller: 'UserController',
      method: 'logout',
      middleware: [Auth()],
    },
  },

  '/userEmail/:email/verify': {
    get: {
      controller: 'UserController',
      method: 'verifyEmail',
    },
  },
  '/users': {
    get: {
      controller: 'UserController',
      method: 'search',
      middleware: [Auth()],
    },
  },
  '/signup': {
    post: {
      controller: 'UserController',
      method: 'create',
    },
  },
  '/users/:id': {
    get: {
      controller: 'UserController',
      method: 'get',
      middleware: [Auth()],
    },
    put: {
      controller: 'UserController',
      method: 'update',
      middleware: [Auth()],
    },
  },
  '/currentUser': {
    get: {
      controller: 'UserController',
      method: 'getCurrent',
      middleware: [Auth()],
    },
  },
  '/updatePassword': {
    put: {
      controller: 'UserController',
      method: 'updatePassword',
      middleware: [Auth()],
    },
  },
};
