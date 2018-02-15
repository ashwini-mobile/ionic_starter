/**
 * Copyright (C) 2017 TopCoder Inc., All Rights Reserved.
 */

/**
 * the Suggestion Request Controller
 *
 * @author      TCSCODER
 * @version     1.0
 */

const SuggestionRequestService = require('../services/SuggestionRequestService');
const _ = require('lodash');

/**
 * create suggestion request
 * @param req the http request
 * @param res the http response
 */
function* create(req, res) {
  res.json(yield SuggestionRequestService.create(_.extend(req.body, { requestorUserId: req.auth.sub })));
}


/**
 * get all suggestion request with paging
 * @param req the http request
 * @param res the http response
 */
function* getAll(req, res) {
  res.json(yield SuggestionRequestService.getAll(req.query));
}

module.exports = { create, getAll };
