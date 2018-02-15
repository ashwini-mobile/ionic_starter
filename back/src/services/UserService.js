/**
 * Copyright (C) 2017 TopCoder Inc., All Rights Reserved.
 */

/**
 * the User service
 *
 * @author      TCSCODER
 * @version     1.0
 */
const models = require('../models');
const crypto = require('crypto');
const joi = require('joi');
const co = require('co');
const util = require('util');
const errors = require('common-errors');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const config = require('config');
const helper = require('../common/helper');
const httpStatus = require('http-status');
const UtilityService = require('../services/UtilityService');

/**
 * the user joi schema
 */
const userSchema = joi.object().keys({
  id: joi.id(),
  local: joi.object().keys({
    email: joi.string().email(),
    username: joi.string(),
    password: joi.string(),
  }),
  facebook: {
    email: joi.string().email(),
    username: joi.string(),
    facebookId: joi.string(),
    token: joi.string(),
  },
  google: {
    email: joi.string().email(),
    username: joi.string(),
    googleId: joi.string(),
    token: joi.string(),
  },
  linkedIn: {
    email: joi.string().email(),
    username: joi.string(),
    linkedInId: joi.string(),
    token: joi.string(),
  },
  type: joi.string(),
}).required().min(1);


/**
 * conert user entity to json object return to frontend
 * @param entity the user entity
 */
function toObject(entity) {
  let obj = entity.toJSON();
  obj = _.omit(obj, 'googleId', 'localId', 'facebookId', 'linkedInId', 'accessToken');
  obj.local = _.pick(obj.local, 'email', 'username');
  obj.google = _.omit(obj.google, 'id');
  obj.facebook = _.omit(obj.facebook, 'id');
  obj.linkedIn = _.omit(obj.linkedIn, 'id');
  obj.types = JSON.parse(obj.types);
  return obj;
}

/**
 * get user from db by id , if user not exist , it will raise an exception
 * @param id
 */
function* getDBUserById(id) {
  const user = yield models.User.findOne({
    where: { id },
    include: [
      { model: models.Local, as: 'local' },
      { model: models.Google, as: 'google' },
      { model: models.Facebook, as: 'facebook' },
      { model: models.LinkedIn, as: 'linkedIn' },
    ],
  });
  if (!user) {
    throw new errors.NotFoundError(`cannot found user where id = ${id}`);
  }
  return user;
}

/**
 * get user by id
 * @param id
 */
function* get(id) {
  const user = yield getDBUserById(id);
  return toObject(user);
}

get.schema = { id: joi.id() };

/**
 * create user
 * @param the host with api version
 * @param entity the user entity
 * @return {*}
 */
function* create(host, entity) {
  /**
   * create new login method
   * @param loginMethod the loginMethod name
   * @param model the model
   * @param additionParams the addition params
   * @return {{}}
   */
  function* createLoginMethod(loginMethod, model, additionParams) {
    const ret = {};
    if (entity[loginMethod]) {
      if (loginMethod === 'local') {
        entity[loginMethod].verified = false;
        entity[loginMethod].password = yield generateHash(entity[loginMethod].password);
        entity[loginMethod].verificationToken = helper.randomStr(6);
      }
      const lm = yield model.create(_.extend({}, entity[loginMethod], additionParams || {}));
      if (loginMethod === 'local') {
        try {
          yield sendVerifyEmail(entity[loginMethod].email, entity[loginMethod].verificationToken, host);
        } catch (e) {
          yield models.Local.remove({ where: { id: lm.id } });
          throw new errors.HttpStatusError(httpStatus.INTERNAL_SERVER_ERROR, 'send email failed.');
        }
      }
      ret[`${loginMethod}Id`] = lm.id;
    }
    return ret;
  }

  return yield models.sequelize.transaction(() => co(function* () {
    const loginProperties = {};
    _.extend(loginProperties, (yield createLoginMethod('local', models.Local)));
    _.extend(loginProperties, (yield createLoginMethod('facebook', models.Facebook)));
    _.extend(loginProperties, (yield createLoginMethod('google', models.Google)));
    _.extend(loginProperties, (yield createLoginMethod('linkedIn', models.LinkedIn)));
    const user = yield models.User.create(_.extend(entity, loginProperties));
    return yield get(user.id);
  }));
}

create.schema = { host: joi.string(), entity: userSchema };


/**
 * update user
 * @param userId the current user id
 * @param id the user id that need update
 * @param entity the user entity
 */
function* update(userId, id, entity) {
  if (userId !== id) {
    throw new errors.NotPermittedError('cannot update other user info.');
  }
  const user = yield getDBUserById(id);

  /**
   * update user login method , if login method not exist , it will create it
   * @param name the login method name
   * @param model the login method model
   * @param loginId the login method id
   * @return {{}}
   */
  function* updateLoginMethod(name, model, loginId) {
    const loginEntity = _.omit(entity[name], 'password');
    const ret = {};
    if (loginEntity) {
      let loginMethod = yield model.findOne({ where: { id: loginId } });

      if (!loginMethod) {
        loginMethod = yield model.create(loginEntity);
      } else {
        yield model.update(loginEntity, { where: { id: loginId } });
      }
      ret[`${name}Id`] = loginMethod.id;
    }
    return ret;
  }

  return yield models.sequelize.transaction(() => co(function* () {
    const loginProperties = {};
    _.extend(loginProperties, (yield updateLoginMethod('local', models.Local, user.dataValues.localId)));
    _.extend(loginProperties, (yield updateLoginMethod('google', models.Google, user.dataValues.googleId)));
    _.extend(loginProperties, (yield updateLoginMethod('facebook', models.Facebook, user.dataValues.facebookId)));
    _.extend(loginProperties, (yield updateLoginMethod('linkedIn', models.LinkedIn, user.dataValues.linkedInId)));
    yield models.User.update(_.extend({}, entity, loginProperties), { where: { id } });
    return yield get(id);
  }));
}

update.schema = { userId: joi.id(), id: joi.id(), entity: userSchema };


/**
 * build db search query
 * @param filter the user search filter
 */
function* buildDBFilter(filter) {
  /**
   * make include search query for login
   * @param model the model
   * @param as the alais name
   * @return {{model: *, as: *, where: {}, required: boolean}}
   */
  function genInclude(model, as) {
    const where = {};
    if (filter.username) where.username = { $like: `%${filter.username}%` };
    if (filter.email) where.email = { $like: `%${filter.email}%` };
    return { model, as, where, required: false };
  }

  const include = [
    genInclude(models.Local, 'local'),
    genInclude(models.Google, 'google'),
    genInclude(models.Facebook, 'facebook'),
    genInclude(models.LinkedIn, 'linkedIn'),
  ];
  return { include, offset: filter.pageIndex * filter.pageSize, limit: filter.pageSize };
}

/**
 * search user by username and email
 * @param filter the user query filter
 * @return {{items: Array, metadata: {pageIndex: *, pageSize: *, totalCount}}}
 */
function* search(filter) {
  const query = yield buildDBFilter(filter);
  const docs = yield models.User.findAndCountAll(query);
  const items = _.map(docs.rows, doc => toObject(doc));
  return {
    items,
    metadata: { pageIndex: filter.pageIndex, pageSize: filter.pageSize, totalCount: docs.count },
  };
}

search.schema = {
  filter: joi.object().keys({
    pageIndex: joi.pageIndex(),
    pageSize: joi.pageSize(),
    username: joi.string(),
    email: joi.string().email(),
  }),
};


/**
 * update user password
 * @param id user id
 * @param newPassword
 * @param oldPassword
 */
function* updatePassword(id, newPassword, oldPassword) {
  const user = yield getDBUserById(id);
  const obj = user.toJSON();
  if (!obj.local) {
    throw new errors.ArgumentError('this user no password can update(no local login method).');
  }

  const passwordMatched = yield verifyPassword(oldPassword, obj.local.password);
  if (!passwordMatched) {
    throw new errors.ArgumentError('old password error.');
  }
  yield models.Local.update({ password: (yield generateHash(newPassword)) }, { where: { id: obj.local.id } });
}

updatePassword.schema = {
  id: joi.id(),
  newPassword: joi.string().required(),
  oldPassword: joi.string().required(),
};


/**
 * use md5 hash password
 * @param password
 * @return {Buffer | string}
 */
function* generateHash(password) {
  const md5sum = crypto.createHash('md5');
  md5sum.update(password);
  return md5sum.digest('hex');
}

/**
 * check password
 * @param password
 * @param hash
 * @return {boolean}
 */
function* verifyPassword(password, hash) {
  const passwordHash = yield generateHash(password);
  return passwordHash === hash;
}

/**
 * verify Email with token
 * @param email the email address
 * @param entity the token entity
 */
function* verifyEmail(email, entity) {
  const user = yield models.User.findOne({
    include: [{
      model: models.Local,
      as: 'local',
      where: { email },
    }],
  });

  if (!user) {
    throw new errors.NotFoundError(`cannot found user where email = ${email}`);
  }
  const obj = user.toJSON();

  if (obj.local) {
    if (obj.local.verified) {
      throw new errors.HttpStatusError(httpStatus.BAD_REQUEST, 'user already verified.');
    }

    if (obj.local.verificationToken === entity.verificationToken) {
      yield models.Local.update({ verified: true, verificationToken: null }, { where: { id: obj.local.id } });
    } else {
      throw new errors.HttpStatusError(httpStatus.BAD_REQUEST, 'user verificationToken error.');
    }
  }
  return { message: `${email} verify succeed.` };
}

verifyEmail.schema = {
  email: joi.string().email().required(),
  entity: joi.object().keys({
    verificationToken: joi.string().required(),
  }).min(1).required(),
};

/**
 * user login use local login method, and save token to db
 * @param entity
 */
function* login(entity) {
  const password = yield generateHash(entity.password);
  const user = yield models.User.findOne({
    include: [
      { model: models.Local, as: 'local', where: { email: entity.email, password } },
      { model: models.Google, as: 'google' },
      { model: models.Facebook, as: 'facebook' },
      { model: models.LinkedIn, as: 'linkedIn' },
    ],
  });

  if (!user) {
    throw new errors.HttpStatusError(httpStatus.CONFLICT, 'the username does not match the password.');
  }

  const userObj = user.toJSON();
  if (!user.local.verified) {
    throw new errors.NotPermittedError('this email is not verified.');
  }

  const accessToken = yield generateToken(userObj);
  yield models.User.update({ accessToken }, { where: { id: user.id } }); // save token to db

  return _.extend(toObject(user), { accessToken });
}

login.schema = {
  entity: joi.object().keys({
    email: joi.string().email().required(),
    password: joi.string().required(),
  }).required(),
};

/**
 * Generate a jwt token for specified user
 * @param  {Object}     userObj     the user for which to generate the token
 */
function* generateToken(userObj) {
  const jwtBody = {
    sub: userObj.id,
  };
  return jwt.sign(jwtBody, new Buffer(config.CLIENT_SECRET, 'base64'), {
    expiresIn: config.TOKEN_EXPIRES,
    audience: config.CLIENT_ID,
  });
}


/**
 * user logout
 * @param userId the user id
 */
function* logout(userId) {
  yield models.User.update({ accessToken: null }, { where: { id: userId } });
}


/**
 * get current login user
 */
function* getCurrent(userId) {
  return yield get(userId);
}

/**
 * update user Types
 * @param id
 * @param addTypes
 * @param deleteTypes
 */
function* updateUserTypes(id, addTypes, deleteTypes) {
  const user = (yield models.User.findOne({ where: { id } })).toJSON();
  let userTypes = [];
  addTypes = addTypes || [];
  deleteTypes = deleteTypes || [];
  try {
    userTypes = JSON.parse(user.types);
  } catch (e) {
    _.noop();
  }

  const types = _.difference(_.union(userTypes, addTypes), deleteTypes);
  yield models.User.update({ types: JSON.stringify(types) }, { where: { id } });
}

/**
 * send email to user
 * @param emailAddress the email address
 * @param verificationToken the verificationToken
 * @param host the host with api version
 */
function* sendVerifyEmail(emailAddress, verificationToken, host) {
  const content = util.format(config.verifyEmailContent,
    emailAddress, verificationToken, `${host}/userEmail/${emailAddress}/verify?verificationToken=${verificationToken}`);
  yield UtilityService.sendEmail({ subject: 'Verify Your Email', to: emailAddress, text: content });
}

module.exports = {
  create,
  update,
  get,
  search,
  updatePassword,
  verifyEmail,
  toObject,
  generateToken,
  verifyPassword,
  login,
  logout,
  getCurrent,
  updateUserTypes,
  generateHash,
};
