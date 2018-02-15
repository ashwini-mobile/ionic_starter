/**
 * Copyright (C) 2017 TopCoder Inc., All Rights Reserved.
 */

/**
 * the Employee Search Filter Controller
 *
 * @author      TCSCODER
 * @version     1.0
 */


const EmployeeSearchFilterService = require('../services/EmployeeSearchFilterService');
const _ = require('lodash');

/**
 * create Employee Profile search filter
 * @param req the http request
 * @param res the http response
 */
function* create(req, res) {
  res.json(yield EmployeeSearchFilterService.create(_.extend(req.body, { userId: req.auth.sub })));
}


/**
 * update Employee Profile search filter
 * @param req the http request
 * @param res the http response
 */
function* update(req, res) {
  res.json(yield EmployeeSearchFilterService.update(
    req.params.id, _.extend(req.body, { userId: req.auth.sub })));
}


/**
 * get Employee Profile search filter by id
 * @param req the http request
 * @param res the http response
 */
function* get(req, res) {
  res.json(yield EmployeeSearchFilterService.get(req.params.id));
}


/**
 * search Employee Profile search filter by user filter
 * @param req the http request
 * @param res the http response
 */
function* search(req, res) {
  res.json(yield EmployeeSearchFilterService.search(req.query));
}


/**
 * remove Employee Profile search filter by id
 * @param req the http request
 * @param res the http response
 */
function* remove(req, res) {
  res.json(yield EmployeeSearchFilterService.remove(req.params.id));
}


/**
 * use Employee Profile search filter to search Employee profile.
 * @param req the http request
 * @param res the http response
 */
function* use(req, res) {
  res.json(yield EmployeeSearchFilterService.use(req.params.id, req.query));
}

module.exports = {
  create, update, get, search, remove, use,
};
