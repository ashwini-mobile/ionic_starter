/**
 * Copyright (C) 2017 TopCoder Inc., All Rights Reserved.
 */

/**
 * the SuggestionRequest Routes
 *
 * @author      TCSCODER
 * @version     1.0
 */
const Auth = require('../common/Auth');

module.exports = {
  '/suggestionRequests': {
    get: {
      controller: 'SuggestionRequestController',
      method: 'getAll',
      middleware: [Auth()],
    },
    post: {
      controller: 'SuggestionRequestController',
      method: 'create',
      middleware: [Auth()],
    },
  },
};
