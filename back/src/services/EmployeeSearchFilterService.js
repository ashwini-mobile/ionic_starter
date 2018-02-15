/**
 * Copyright (C) 2017 TopCoder Inc., All Rights Reserved.
 */

/**
 * the Employee Search Filter Service
 *
 * @author      TCSCODER
 * @version     1.0
 */


const joi = require('joi');
const errors = require('common-errors');
const _ = require('lodash');
const models = require('../models');
const helper = require('../common/helper');
const EmployeeProfileService = require('./EmployeeProfileService');
const EmployerSearchFilterService = require('./EmployerSearchFilterService');
const UtilityService = require('./UtilityService');
const co = require('co');


module.exports = { create, update, get, search, remove, use };

/**
 * the EmployeeSearchFilter joi schema
 */
const filterSchema = joi.object().keys({
  id: joi.id(),
  userId: joi.id(),
  name: joi.string(),
  degree: joi.degree(),
  distance: joi.number().integer(),
  closeTo: joi.locality(),
  occupationId: joi.id(),
  answers: joi.filterMatchingAnswers(),
});


/**
 * convert db entity to json object
 */
function toObject(entity) {
  const ret = _.omit(entity.toJSON(), 'closeToId');
  ret.answers = JSON.parse(ret.answers);
  return ret;
}

/**
 * create or update EmployeeSearchFilter
 * @param entity
 * @param type
 * @return {*}
 */
function* createOrUpdateFilter(entity, type) {
  return yield models.sequelize.transaction(() => co(function* () {
    if (entity.closeTo) {
      entity.closeToId = (yield helper.createOrUpdate(models.Locality, entity.closeTo)).id;
    }
    let filterId = entity.id;
    entity.answers = JSON.stringify(entity.answers);
    if (type === 'update') {
      yield models.EmployeeSearchFilter.update(entity, { where: { id: entity.id } });
    } else {
      filterId = (yield models.EmployeeSearchFilter.create(entity)).id;
    }
    return yield get(filterId);
  }));
}

/**
 * create search filter
 * @param entity
 * @return {*}
 */
function* create(entity) {
  return yield createOrUpdateFilter(entity, 'create');
}

create.schema = { entity: filterSchema };


/**
 * update search filter
 * @param id
 * @param entity
 */
function* update(id, entity) {
  const obj = yield get(id);
  const newEntity = _.merge(obj, entity);
  return yield createOrUpdateFilter(newEntity, 'update');
}

update.schema = { id: joi.id(), entity: filterSchema };

/**
 * get EmployeeSearchFilter by id
 * @param id
 */
function* get(id) {
  const entity = yield models.EmployeeSearchFilter.findOne({
    where: { id }, include: [{ model: models.Locality, as: 'closeTo' }],
  });
  if (!entity) {
    throw new errors.NotFoundError(`cannot found EmployeeSearchFilter where id = ${id}`);
  }
  return toObject(entity);
}

/**
 * search EmployeeSearchFilter by filter
 * @param filter
 * @return {{items: Array, metadata: ({pageIndex, pageSize, totalCount}|*)}}
 */
function* search(filter) {
  const query = helper.buildPaging(filter);
  const where = {};
  if (filter.userId) where.userId = filter.userId;
  if (filter.name) where.name = { $like: `%${filter.name}%` };

  query.where = where;
  query.include = [{ model: models.Locality, as: 'closeTo' }];

  const docs = yield models.EmployeeSearchFilter.findAndCountAll(query);
  const items = _.map(docs.rows, r => toObject(r));
  return {
    items,
    metadata: helper.buildMetadata(docs, filter),
  };
}

search.schema = {
  filter: joi.object().keys({
    pageIndex: joi.pageIndex(),
    pageSize: joi.pageSize(),
    userId: joi.id(),
    name: joi.string(),
  }),
};

/**
 * remove EmployeeSearchFilter by id
 * @param id
 */
function* remove(id) {
  yield get(id);
  yield models.EmployeeSearchFilter.destroy({ where: { id } });
}


/**
 * use search filter to search
 * @param id
 * @param paging
 * @returns {{items: Array, metadata: ({pageIndex, pageSize, totalCount}|*)}}
 */
function* use(id, paging) {
  const filter = yield get(id);
  const pagingFilter = helper.buildPaging(paging);
  const dbFilter = yield buildDBFilter(filter);

  let docs = yield models.EmployeeProfile.findAll(_.extend(dbFilter, { distinct: true }));
  if (docs.length === 0) {
    return { items: [], metadata: helper.buildMetadata({ count: 0 }, paging) };
  }

  docs = _.map(docs, d => d.toJSON());
  if (filter.distance && filter.distance > 0 && filter.closeTo) { // check closeTo and distance params
    docs = _.filter(docs, d => // filter the employee by employeeLocation
      _.isObject(d.employeeLocation) && !_.isEmpty(d.employeeLocation) && d.employeeLocation.locality,
    );
    const distances = yield UtilityService.getDistances([filter.closeTo.locality],
      _.map(docs, d => d.employeeLocation.locality)); // get all employee distance
    docs = _.filter(docs, (d, index) => filter.distance > distances[index].distanceValue); // filter by distance
  }
  const count = docs.length;
  docs = docs.slice(pagingFilter.offset, pagingFilter.offset + pagingFilter.limit); // paging
  const items = [];
  for (let i = 0; i < docs.length; i += 1) {
    items.push(yield EmployeeProfileService.exportToObject(docs[i]));
  }

  return {
    items,
    metadata: helper.buildMetadata({ count }, paging),
  };
}

use.schema = {
  id: joi.id(),
  paging: joi.object().keys({
    pageIndex: joi.pageIndex(),
    pageSize: joi.pageSize(),
  }),
};


/**
 * build db filter
 * @param filter
 */
function* buildDBFilter(filter) {
  const where = { status: models.Const.ProfileStatus.active };
  const occupationWhere = {};
  if (filter.occupationId) {
    occupationWhere.id = filter.occupationId; // occupation query
  }
  const degreeWhere = {};
  if (filter.degree) {
    degreeWhere.degree = filter.degree; // degree query
  }

  const profileInclude = yield EmployerSearchFilterService.buildProfileQuestFilter(filter);
  const include = [
    { model: models.Locality, as: 'employeeLocation' },
    { model: models.EmployeeAvailability, as: 'availability' },
    { model: models.EmploymentRecord, as: 'employementHistory' },
    { model: models.School, as: 'educationHistory', where: degreeWhere },
    { model: models.Occupation, as: 'occupation', where: occupationWhere },
    { model: models.Locality, as: 'potentialEmployeeLocations' },
    { model: models.Photo, as: 'photos' },
    profileInclude,
  ];

  return { where, include };
}

