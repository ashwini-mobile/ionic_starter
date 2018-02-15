/**
 * Copyright (C) 2017 TopCoder Inc., All Rights Reserved.
 */

/**
 * the EmployerSearchFilter Routes
 *
 * @author      TCSCODER
 * @version     1.0
 */

const Auth = require('../common/Auth');

module.exports = {
  '/employerSearchFilters': {
    get: {
      controller: 'EmployerSearchFilterController',
      method: 'search',
      middleware: [Auth()],
    },
    post: {
      controller: 'EmployerSearchFilterController',
      method: 'create',
      middleware: [Auth()],
    },
  },
  '/employerSearchFilters/:id': {
    get: {
      controller: 'EmployerSearchFilterController',
      method: 'get',
      middleware: [Auth()],
    },
    put: {
      controller: 'EmployerSearchFilterController',
      method: 'update',
      middleware: [Auth()],
    },
    delete: {
      controller: 'EmployerSearchFilterController',
      method: 'remove',
      middleware: [Auth()],
    },
  },
  '/employerSearchFilters/:id/use': {
    put: {
      controller: 'EmployerSearchFilterController',
      method: 'use',
      middleware: [Auth()],
    },
  },
};
