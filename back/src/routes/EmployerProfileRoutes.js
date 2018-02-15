/**
 * Copyright (C) 2017 TopCoder Inc., All Rights Reserved.
 */

/**
 * the EmployerProfile Routes
 *
 * @author      TCSCODER
 * @version     1.0
 */

const Auth = require('../common/Auth');

module.exports = {
  '/employerProfiles': {
    get: {
      controller: 'EmployerProfileController',
      method: 'getByUserId',
      middleware: [Auth()],
    },
    post: {
      controller: 'EmployerProfileController',
      method: 'create',
      middleware: [Auth()],
    },
  },
  '/employerProfiles/:id': {
    get: {
      controller: 'EmployerProfileController',
      method: 'get',
      middleware: [Auth()],
    },
    put: {
      controller: 'EmployerProfileController',
      method: 'update',
      middleware: [Auth()],
    },
    delete: {
      controller: 'EmployerProfileController',
      method: 'remove',
      middleware: [Auth()],
    },
  },
};
