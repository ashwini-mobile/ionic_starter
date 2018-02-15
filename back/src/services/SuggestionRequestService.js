/**
 * Copyright (C) 2017 TopCoder Inc., All Rights Reserved.
 */

/**
 * the Suggestion Request Service
 *
 * @author      TCSCODER
 * @version     1.0
 */


const models = require('../models');
const joi = require('joi');
const helper = require('../common/helper');

/**
 * create suggestionRequest
 * @param entity the suggestionRequest entity
 */
function* create(entity) {
  entity.status = models.Const.RequestStatus.new;
  return yield models.SuggestionRequest.create(entity);
}

create.schema = {
  entity: joi.object().keys({
    id: joi.id(),
    query: joi.string().required(),
    email: joi.string().email().required(),
    status: joi.requestStatus(),
    requestorUserId: joi.id().required(),
    createdAt: joi.date(),
    updatedAt: joi.date(),
  }).required(),
};

/**
 * get all by paging
 * @param filter
 * @return {{items: (*), metadata: ({pageIndex, pageSize, totalCount}|*)}}
 */
function* getAll(filter) {
  const query = helper.buildPaging(filter);
  const docs = yield models.SuggestionRequest.findAndCountAll(query);
  return {
    items: docs.rows,
    metadata: helper.buildMetadata(docs, filter),
  };
}

getAll.schema = {
  filter: joi.object().keys({
    pageIndex: joi.pageIndex(),
    pageSize: joi.pageSize(),
  }),
};

module.exports = { create, getAll };
