/**
 * Copyright (C) 2017 TopCoder Inc., All Rights Reserved.
 */

/**
 * the look up controller
 *
 * @author      TCSCODER
 * @version     1.0
 */

const LookupService = require('../services/LookupService');

/**
 * get all Occupations with paging
 * @param req the http request
 * @param res the http response
 */
function* getAllOccupations(req, res) {
  res.json(yield LookupService.getAllOccupations(req.query));
}


/**
 * get all Specializations with paging
 * @param req the http request
 * @param res the http response
 */
function* getAllSpecializations(req, res) {
  res.json(yield LookupService.getAllSpecializations(req.query));
}

module.exports = {
  getAllOccupations,
  getAllSpecializations,
};
