/**
 * Copyright (C) 2017 TopCoder Inc., All Rights Reserved.
 */

/**
 * the look up service
 *
 * @author      TCSCODER
 * @version     1.0
 */
const joi = require('joi');
const helper = require('../common/helper');
const models = require('../models');
const _ = require('lodash');

const schema = {
  filter: joi.object().keys({
    pageIndex: joi.pageIndex(),
    pageSize: joi.pageSize(),
  }),
};

/**
 * get all Occupations
 * @param filter {pageIndex,pageSize}
 * @return {*}
 */
function* getAllOccupations(filter) {
  const query = helper.buildPaging(filter);
  const docs = yield models.Occupation.findAndCountAll(query);
  const items = _.map(docs.rows, r => _.omit(r.toJSON(), 'numInList'));
  return {
    items,
    metadata: helper.buildMetadata(docs, filter),
  };
}

getAllOccupations.schema = schema;

/**
 * get all Specializations with paging
 * @param filter {pageIndex,pageSize}
 * @return {*}
 */
function* getAllSpecializations(filter) {
  const query = helper.buildPaging(filter);
  const docs = yield models.Specialization.findAndCountAll(query);
  const items = _.map(docs.rows, r => _.omit(r.toJSON(), 'numInList'));
  return {
    items,
    metadata: helper.buildMetadata(docs, filter),
  };
}

getAllSpecializations.schema = schema;

module.exports = {
  getAllOccupations,
  getAllSpecializations,
};
