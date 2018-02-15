/**
 * Copyright (C) 2017 TopCoder Inc., All Rights Reserved.
 */

/**
 * the Employee Profile Controller
 *
 * @author      TCSCODER
 * @version     1.0
 */

const EmployeeProfileService = require('../services/EmployeeProfileService');
const _ = require('lodash');

/**
 * create Employee Profile
 * @param req the http request
 * @param res the http response
 */
function* create(req, res) {
  const entity = _.extend({}, req.body, { userId: req.auth.sub });
  res.json(yield EmployeeProfileService.create(entity));
}

/**
 * update Employee Profile
 * @param req the http request
 * @param res the http response
 */
function* update(req, res) {
  res.json(yield EmployeeProfileService.update(req.auth.sub, req.params.id, req.body));
}

/**
 * get Employee Profile by params id
 * @param req the http request
 * @param res the http response
 */
function* get(req, res) {
  res.json(yield EmployeeProfileService.get(req.params.id));
}

/**
 * remove Employee Profile by params id
 * @param req the http request
 * @param res the http response
 */
function* remove(req, res) {
  res.json(yield EmployeeProfileService.remove(req.params.id));
}


/**
 * get profile by user id
 * @param req the http request
 * @param res the http response
 */
function* getByUserId(req, res) {
  res.json(yield EmployeeProfileService.getByUserId(req.query));
}


module.exports = { create, update, get, remove, getByUserId };
