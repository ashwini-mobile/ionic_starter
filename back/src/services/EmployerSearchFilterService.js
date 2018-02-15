/**
 * Copyright (C) 2017 TopCoder Inc., All Rights Reserved.
 */

/**
 * the Employer Search Filter Service
 *
 * @author      TCSCODER
 * @version     1.0
 */

const joi = require('joi');
const errors = require('common-errors');
const _ = require('lodash');
const models = require('../models');
const helper = require('../common/helper');
const EmployerProfileService = require('./EmployerProfileService');
const co = require('co');
const UtilityService = require('./UtilityService.js');


/**
 * the EmployerSearchFilter joi schema
 */
const filterSchema = joi.object().keys({
  id: joi.id(),
  userId: joi.id(),
  name: joi.string(),
  degree: joi.degree(),
  distance: joi.number().integer(),
  closeTo: joi.locality(),
  occupationId: joi.id(),
  employerName: joi.string(),
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
 * create or update EmployerSearchFilter
 * @param entity
 * @param type
 * @return {*}
 */
function* createOrUpdateFilter(entity, type) {
  return yield models.sequelize.transaction(() => co(function* () {
    if (entity.closeTo) {
      entity.closeToId = (yield helper.createOrUpdate(models.Locality, entity.closeTo)).id;
    }
    entity.answers = JSON.stringify(entity.answers);
    let filterId = entity.id;
    if (type === 'update') {
      yield models.EmployerSearchFilter.update(entity, { where: { id: entity.id } });
    } else {
      filterId = (yield models.EmployerSearchFilter.create(entity)).id;
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
 * get EmployerSearchFilter by id
 * @param id
 */
function* get(id) {
  const entity = yield models.EmployerSearchFilter.findOne({
    where: { id }, include: [{ model: models.Locality, as: 'closeTo' }],
  });
  if (!entity) {
    throw new errors.NotFoundError(`cannot found EmployerSearchFilter where id = ${id}`);
  }
  return toObject(entity);
}

/**
 * search EmployerSearchFilter by filter
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

  const docs = yield models.EmployerSearchFilter.findAndCountAll(query);
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
 * remove EmployerSearchFilter by id
 * @param id
 */
function* remove(id) {
  yield get(id);
  yield models.EmployerSearchFilter.destroy({ where: { id } });
}


/**
 * get Employer Office Locations and create hash table that location index for employer index
 * @param employers
 * @returns {{hash: {}, localtions: Array}}
 */
function getEmployerOfficeLocations(employers) {
  const hash = {}; // location index for employer index
  const localtions = [];

  _.each(employers, (employer, eIndex) => {
    if (!employer.offices || employer.offices.length < 0) return; // check offices
    _.each(employer.offices, (office) => {
      if (office.address && office.address.locality && office.address.locality.locality) { // check the office localtion
        localtions.push(office.address.locality.locality);
        hash[localtions.length - 1] = eIndex;
      }
    });
  });
  return { hash, localtions };
}

/**
 * use user search filter to search profiles
 * @param id the filter id
 * @param paging the paging data
 * @returns {{items: Array, metadata: ({pageIndex, pageSize, totalCount}|*)}}
 */
function* use(id, paging) {
  const filter = yield get(id);
  const pagingFilter = helper.buildPaging(paging);
  const dbFilter = yield buildDBFilter(filter);

  let docs = yield models.EmployerProfile.findAll(_.extend(dbFilter, { distinct: true }));
  if (docs.length === 0) {
    return { items: [], metadata: helper.buildMetadata({ count: 0 }, paging) };
  }

  docs = _.map(docs, d => d.toJSON());
  if (filter.distance && filter.distance > 0 && filter.closeTo) { // check closeTo and distance params
    const { hash, localtions } = getEmployerOfficeLocations(docs);
    const distances = yield UtilityService.getDistances([filter.closeTo.locality], localtions); // get all employee distance
    const inRangeIndexs = [];
    _.each(distances, (distance, index) => {
      if (distance.distanceValue <= filter.distance) {
        inRangeIndexs.push(hash[index]); // filter by distance
      }
    });
    docs = _.filter(docs, (d, index) => _.find(inRangeIndexs, i => i === index) !== undefined);
  }
  const count = docs.length;
  docs = docs.slice(pagingFilter.offset, pagingFilter.offset + pagingFilter.limit); // paging
  const items = [];
  for (let i = 0; i < docs.length; i += 1) {
    items.push(yield EmployerProfileService.exportToObject(docs[i]));
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
 * build ProfileQuest Filter
 * @param filter
 */
function* buildProfileQuestFilter(filter) {
  const profileQuestionWhere = {};
  const selectOptionsWhere = {};
  if (filter.answers && filter.answers.length > 0) {
    profileQuestionWhere.questionId = { $in: _.map(filter.answers, answer => answer.questionId) };
    const optionsId = [];
    _.each(filter.answers, (answer) => {
      _.each(answer.matchingAnswerOptions, optionId => optionsId.push(optionId));
    });
    if (optionsId.length > 0) {
      selectOptionsWhere.id = { $in: optionsId };
    }
  }

  return {
    model: models.ProfileQuestionAnswer,
    as: 'profileQuestionAnswers',
    where: profileQuestionWhere,
    include: [{
      model: models.QuestionAnswerOption,
      as: 'selectedAnswerOptions',
      where: selectOptionsWhere,
    }],
  };
}

/**
 * build db filter by user search filter
 * @param filter
 */
function* buildDBFilter(filter) {
  const where = { status: models.Const.ProfileStatus.active };
  if (filter.employerName) {
    where.businessName = { $like: `%${filter.employerName}%` };
  }
  const occupationWhere = {};
  if (filter.occupationId) {
    occupationWhere.id = filter.occupationId;
  }

  const profileInclude = yield buildProfileQuestFilter(filter);

  const include = [
    {
      model: models.Office,
      as: 'offices',
      include: [{ model: models.OfficeAddress, as: 'address', include: [{ model: models.Locality, as: 'locality' }] }],
    },
    { model: models.Specialization, as: 'specializations' },
    { model: models.Occupation, as: 'areasToStaff', where: occupationWhere },
    { model: models.Schedule, as: 'schedule' },
    { model: models.Photo, as: 'photos' },
    {
      model: models.OfficeManager,
      as: 'officeManagers',
      include: [{ model: models.AdministratorPermission, as: 'permissions' }],
    },
    profileInclude,
    {
      model: models.EmployeeOrganization,
      as: 'employeeOrganization',
      include: [{
        model: models.EmployeeOrganizationEmployee,
        as: 'root',
        include: [{ model: models.EmployeeOrganizationEmployee, as: 'children' }],
      }],
    },
  ];

  return { where, include };
}


module.exports = { create, update, get, search, remove, use, buildProfileQuestFilter };
