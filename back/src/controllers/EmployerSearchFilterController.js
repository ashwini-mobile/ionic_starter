/**
 * Copyright (C) 2017 TopCoder Inc., All Rights Reserved.
 */

/**
 * the Employer Search Filter Controller
 *
 * @author      TCSCODER
 * @version     1.0
 */


const EmployerSearchFilterService = require('../services/EmployerSearchFilterService');
const _ = require('lodash');


/**
 * create Employer Profile search filter
 * @param req the http request
 * @param res the http response
 */
function* create(req, res) {
  res.json(yield EmployerSearchFilterService.create(_.extend(req.body, { userId: req.auth.sub })));
}


/**
 * update Employer Profile search filter.
 * @param req the http request
 * @param res the http response
 */
function* update(req, res) {
  res.json(yield EmployerSearchFilterService.update(req.params.id, _.extend(req.body, { userId: req.auth.sub })));
}


/**
 * get Employer Profile search filter by id.
 * @param req the http request
 * @param res the http response
 */
function* get(req, res) {
  res.json(yield EmployerSearchFilterService.get(req.params.id));
}


/**
 * search Employer Profile search filter by user query.
 * @param req the http request
 * @param res the http response
 */
function* search(req, res) {
  res.json(yield EmployerSearchFilterService.search(req.query));
}


/**
 * remove Employer Profile search filter.
 * @param req the http request
 * @param res the http response
 */
function* remove(req, res) {
  res.json(yield EmployerSearchFilterService.remove(req.params.id));
}


/**
 * use Employer Profile search filter to search Employer profile.
 * @param req the http request
 * @param res the http response
 */
function* use(req, res) {
  res.json(yield EmployerSearchFilterService.use(req.params.id, req.query));
}

module.exports = {
  create, update, get, search, remove, use,
};
