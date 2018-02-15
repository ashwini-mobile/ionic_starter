/**
 * Copyright (C) 2017 TopCoder Inc., All Rights Reserved.
 */

/**
 * Contains generic helper methods
 *
 * @author      TCSCODER
 * @version     1.0
 */

const _ = require('lodash');
const co = require('co');
const config = require('config');

/**
 * get a random string with length
 * @param len
 * @param chars the chars
 * @returns {string}
 */
function randomStr(len, chars) {
  const newLen = len || 32;
  const $chars = chars ||
    'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';
  const maxPos = $chars.length;
  let pwd = '';
  for (let i = 0; i < newLen; i += 1) {
    pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
  }
  return pwd;
}

/**
 * acoording docs count and paging to create metadata
 * @param docs the db docs
 * @param paging the paging info
 * @return {{pageIndex: *, pageSize: *, totalCount}}
 */
function buildMetadata(docs, paging) {
  return { pageIndex: paging.pageIndex, pageSize: paging.pageSize, totalCount: docs.count };
}


/**
 * get host with api version , example like http://localhost:3000/api/v1
 * @param req
 * @return {string}
 */
function getHostWithApiVersion(req) {
  return `${req.protocol}://${req.headers.host}/${config.API_VERSION}`;
}

/**
 * build paging object
 * @param filter
 * @return {{offset: number, limit: *}}
 */
function buildPaging(filter) {
  return { offset: filter.pageIndex * filter.pageSize, limit: filter.pageSize };
}

/**
 * if entity got id, then update it by id, othewise , create new entity
 * @param model the model
 * @param entity the entity
 * @return {*}
 */
function* createOrUpdate(model, entity) {
  if (entity.id) {
    yield model.update(entity, { where: { id: entity.id } });
    return entity;
  }
  return (yield model.create(entity)).toJSON();
}

/**
 * create or update entities , same as createOrUpdate
 * @param the db model
 * @param entities
 */
function* createOrUpdateArrayItems(model, entities) {
  const results = [];
  for (let i = 0; i < entities.length; i += 1) {
    const e = yield createOrUpdate(model, entities[i]);
    results.push(e.id);
  }
  return results;
}


/**
 * Wrap generator function to standard express function
 * @param {Function} fn the generator function
 * @returns {Function} the wrapped function
 */
function wrapExpress(fn) {
  return function (req, res, next) {
    co(fn(req, res, next)).catch(next);
  };
}

/**
 * Wrap all generators from object
 * @param obj the object (controller exports)
 * @returns {Object|Array} the wrapped object
 */
function autoWrapExpress(obj) {
  if (_.isArray(obj)) {
    return obj.map(autoWrapExpress);
  }
  if (_.isFunction(obj)) {
    if (obj.constructor.name === 'GeneratorFunction') {
      return wrapExpress(obj);
    }
    return obj;
  }
  _.each(obj, (value, key) => {
    obj[key] = autoWrapExpress(value);
  });
  return obj;
}


module.exports = {
  wrapExpress,
  autoWrapExpress,
  buildMetadata,
  buildPaging,
  createOrUpdate,
  createOrUpdateArrayItems,
  randomStr,
  getHostWithApiVersion,
};

