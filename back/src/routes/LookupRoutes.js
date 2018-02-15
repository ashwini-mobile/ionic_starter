/**
 * Copyright (C) 2017 TopCoder Inc., All Rights Reserved.
 */

/**
 * the Lookup Routes
 *
 * @author      TCSCODER
 * @version     1.0
 */


module.exports = {
  '/occupations': {
    get: {
      controller: 'LookupController',
      method: 'getAllOccupations',
    },
  },
  '/specializations': {
    get: {
      controller: 'LookupController',
      method: 'getAllSpecializations',
    },
  },
};
