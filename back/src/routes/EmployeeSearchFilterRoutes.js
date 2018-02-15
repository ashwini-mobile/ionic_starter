/**
 * Copyright (C) 2017 TopCoder Inc., All Rights Reserved.
 */

/**
 * the EmployeeSearchFilter Routes
 *
 * @author      TCSCODER
 * @version     1.0
 */
const Auth = require('../common/Auth');

module.exports = {
  '/employeeSearchFilters': {
    get: {
      controller: 'EmployeeSearchFilterController',
      method: 'search',
      middleware: [Auth()],
    },
    post: {
      controller: 'EmployeeSearchFilterController',
      method: 'create',
      middleware: [Auth()],
    },
  },
  '/employeeSearchFilters/:id': {
    get: {
      controller: 'EmployeeSearchFilterController',
      method: 'get',
      middleware: [Auth()],
    },
    put: {
      controller: 'EmployeeSearchFilterController',
      method: 'update',
      middleware: [Auth()],
    },
    delete: {
      controller: 'EmployeeSearchFilterController',
      method: 'remove',
      middleware: [Auth()],
    },
  },
  '/employeeSearchFilters/:id/use': {
    put: {
      controller: 'EmployeeSearchFilterController',
      method: 'use',
      middleware: [Auth()],
    },
  },
};
