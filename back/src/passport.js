/**
 * Copyright (C) 2017 TopCoder Inc., All Rights Reserved.
 */


/**
 * the passport auth file
 *
 * @author      TCSCODER
 * @version     1.0
 */

const config = require('config');
const passport = require('passport');
const _ = require('lodash');
const co = require('co');
const models = require('./models');
const helper = require('./common/helper');
const FacebookStrategy = require('passport-facebook');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const UserService = require('./services/UserService');
const LinkedInStrategy = require('passport-linkedin-oauth2').Strategy;


/**
 * get the auth callback url predix
 * @param req the request
 */
const getCallbackPredix = req => helper.getHostWithApiVersion(req);

/**
 * the passport default serializeUser method
 */
passport.serializeUser((user, cb) => {
  cb(null, user);
});

/**
 * the passport default deserializeUser method
 */
passport.deserializeUser((obj, cb) => {
  cb(null, obj);
});


/**
 * create the auth function
 * @param authType , the auth type(google,facebook,linkedIn)
 * @param scope the auth scope
 * @return {function(*=, *=, *=)}
 */
const createAuthFunc = (authType, scope) => {
  const strategies = {
    google: GoogleStrategy,
    facebook: FacebookStrategy,
    linkedIn: LinkedInStrategy,
  };
  const Strategy = strategies[authType];
  const strategyEntity = {
    clientID: config[authType].clientId,
    clientSecret: config[authType].clientSecret,
    scope,
  };
  if (authType === 'facebook') {
    strategyEntity.profileFields = scope;
  }
  return (req, res, next) => {
    passport.use(new Strategy(
      _.extend(strategyEntity, { callbackURL: `${getCallbackPredix(req)}/auth/${authType}/callback` }),
      ((accessToken, refreshToken, profile, cb) => cb(null, profile)),
    ));
    return passport.authenticate(authType === 'linkedIn' ? 'linkedin' : authType, { scope })(req, res, next);
  };
};

/**
 * get auth entity and auth query (to found match user)
 * @param authType the auth type
 * @param user the use
 * @returns {*}
 */
const getEntityAndQuery = (authType, user) => {
  const idName = `${authType}Id`;

  const entity = { username: user.displayName };
  entity[idName] = user.id;

  try {
    entity.email = user.emails[0].value; // if email exist , use email as query key
    return { entity, where: { email: entity.email } };
  } catch (e) {
    const where = {};
    where[idName] = user.id; // otherwist , user id as query key
    return { entity, where };
  }
};

/**
 * the common auth callback
 * @param authType the auth type
 * @param entity the auth user entity
 * @param where the db query to found user
 * @param req the request
 * @param res the response
 * @param next the next
 */
const authCallback = (authType, req, res, next) => {
  const { entity, where } = getEntityAndQuery(authType, req.user);
  co(function* () {
    const model = models[`${authType[0].toUpperCase()}${authType.slice(1)}`];
    let user = yield models.User.findOne({
      include: [{ model, where, as: authType }],
    }); // find by auth query
    if (!user) { // user not exist
      const userEntity = {};
      userEntity[authType] = entity;
      user = yield UserService.create(getCallbackPredix(req), userEntity);
    } else {
      user = user.toJSON();
      user = yield UserService.get(user.id);
    }
    const accessToken = yield UserService.generateToken(user); // create token
    yield models.User.update({ accessToken }, { where: { id: user.id } }); // save token
    res.json(_.extend(user, { accessToken })); // return to user
  }).catch((err) => {
    next(err);
  });
};

/**
 * the facebook callback
 */
const facebookCallback = (req, res, next) => {
  authCallback('facebook', req, res, next);
};

/**
 * the google callack
 */
const googleCallback = (req, res, next) => {
  authCallback('google', req, res, next);
};

/**
 * the linkedIn callback
 */
const linkedInCallback = (req, res, next) => {
  authCallback('linkedIn', req, res, next);
};


module.exports = {
  init: (app) => { // register passport auth uri
    app.get(`/${config.API_VERSION}/auth/facebook`, createAuthFunc('facebook', ['email']));
    app.get(`/${config.API_VERSION}/auth/facebook/callback`, passport.authenticate('facebook'), facebookCallback);
    app.get(`/${config.API_VERSION}/auth/google`, createAuthFunc('google', ['profile', 'email']));
    app.get(`/${config.API_VERSION}/auth/google/callback`, passport.authenticate('google'), googleCallback);
    app.get(`/${config.API_VERSION}/auth/linkedIn`, createAuthFunc('linkedIn', ['r_emailaddress', 'r_basicprofile']));
    app.get(`/${config.API_VERSION}/auth/linkedIn/callback`, passport.authenticate('linkedin'), linkedInCallback);
  },
};
