/**
 * Copyright (C) 2017 TopCoder Inc., All Rights Reserved.
 */

/**
 * the HelpRequest Routes
 *
 * @author      TCSCODER
 * @version     1.0
 */
const Auth = require('../common/Auth');

module.exports = {
  '/helpRequests': {
    get: {
      controller: 'HelpRequestController',
      method: 'getAll',
      middleware: [Auth()],
    },
    post: {
      controller: 'HelpRequestController',
      method: 'create',
      middleware: [Auth()],
    },
  },
};
