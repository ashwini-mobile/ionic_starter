/**
 * Copyright (c) 2017 Zero Inc, All rights reserved.
 */


/**
 * user Controller
 *
 * @author      JiangLiwu
 * @version     1.0
 */

const UserService = require('../services/UserService');
const helper = require('../common/helper');

/**
 * verify Email with token
 * @param req the http request
 * @param res the http response
 */
function* verifyEmail(req, res) {
  res.json(yield UserService.verifyEmail(req.params.email, req.query));
}


/**
 * search user
 * @param req the http request
 * @param res the http response
 */
function* search(req, res) {
  res.json(yield UserService.search(req.query));
}


/**
 * create user (singup)
 * @param req the http request
 * @param res the http response
 */
function* create(req, res) {
  res.json(yield UserService.create(helper.getHostWithApiVersion(req), req.body));
}

/**
 * update user info
 * @param req the http request
 * @param res the http response
 */
function* update(req, res) {
  res.json(yield UserService.update(req.auth.sub, req.params.id, req.body));
}

/**
 * get user by id
 * @param req the http request
 * @param res the http response
 */
function* get(req, res) {
  res.json(yield UserService.get(req.params.id));
}

/**
 * get current user
 * @param req the http request
 * @param res the http response
 */
function* getCurrent(req, res) {
  res.json(yield UserService.getCurrent(req.auth.sub));
}

/**
 * update user local password
 * @param req the http request
 * @param res the http response
 */
function* updatePassword(req, res) {
  res.json(yield UserService.updatePassword(
    req.auth.sub, req.body.newPassword, req.body.oldPassword));
}

/**
 * user login with local email and password
 * @param req the http request
 * @param res the http response
 */
function* login(req, res) {
  res.json(yield UserService.login(req.body));
}

/**
 * user logout
 * @param req
 * @param res
 */
function* logout(req, res) {
  res.json(yield UserService.logout(req.auth.sub));
}


module.exports = {
  verifyEmail, search, create, update, get, getCurrent, updatePassword, login, logout,
};
