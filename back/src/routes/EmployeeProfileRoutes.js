/**
 * Copyright (C) 2017 TopCoder Inc., All Rights Reserved.
 */

/**
 * the EmployeeProfile Routes
 *
 * @author      TCSCODER
 * @version     1.0
 */
const Auth = require('../common/Auth');

module.exports = {
  '/employeeProfiles': {
    get: {
      controller: 'EmployeeProfileController',
      method: 'getByUserId',
      middleware: [Auth()],
    },
    post: {
      controller: 'EmployeeProfileController',
      method: 'create',
      middleware: [Auth()],
    },
  },
  '/employeeProfiles/:id': {
    get: {
      controller: 'EmployeeProfileController',
      method: 'get',
      middleware: [Auth()],
    },
    put: {
      controller: 'EmployeeProfileController',
      method: 'update',
      middleware: [Auth()],
    },
    delete: {
      controller: 'EmployeeProfileController',
      method: 'remove',
      middleware: [Auth()],
    },
  },
};
