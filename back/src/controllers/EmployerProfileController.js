/**
 * Copyright (C) 2017 TopCoder Inc., All Rights Reserved.
 */

/**
 * the Employer Profile Controller
 *
 * @author      TCSCODER
 * @version     1.0
 */

const EmployerProfileService = require('../services/EmployerProfileService');
const _ = require('lodash');

/**
 * create Employer Profile
 * @param req the http request
 * @param res the http response
 */
function* create(req, res) {
  res.json(yield EmployerProfileService.create(_.extend({}, req.body, { userId: req.auth.sub })));
}


/**
 * update Employer Profile by id
 * @param req the http request
 * @param res the http response
 */
function* update(req, res) {
  res.json(yield EmployerProfileService.update(
    req.params.id, _.extend({}, req.body, { userId: req.auth.sub })));
}


/**
 * get Employer Profile by id
 * @param req the http request
 * @param res the http response
 */
function* get(req, res) {
  res.json(yield EmployerProfileService.get(req.params.id));
}


/**
 * remove Employer Profile by id
 * @param req the http request
 * @param res the http response
 */
function* remove(req, res) {
  res.json(yield EmployerProfileService.remove(req.params.id));
}


/**
 * get Employer Profile by user id
 * @param req the http request
 * @param res the http response
 */
function* getByUserId(req, res) {
  res.json(yield EmployerProfileService.getByUserId(req.query));
}


module.exports = { create, update, get, remove, getByUserId };
