/**
 * Copyright (C) 2017 TopCoder Inc., All Rights Reserved.
 */

/**
 * the help Request Controller
 *
 * @author      TCSCODER
 * @version     1.0
 */

const HelpRequestService = require('../services/HelpRequestService');
const _ = require('lodash');

/**
 * create Help request
 * @param req the http request
 * @param res the http response
 */
function* create(req, res) {
  res.json(yield HelpRequestService.create(_.extend(req.body, { requestorUserId: req.auth.sub })));
}

/**
 * get all help request with paging
 * @param req the http request
 * @param res the http response
 */
function* getAll(req, res) {
  res.json(yield HelpRequestService.getAll(req.query));
}

module.exports = { create, getAll };
