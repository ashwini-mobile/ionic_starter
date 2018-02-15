/**
 * Copyright (C) 2017 TopCoder Inc., All Rights Reserved.
 */

/**
 * the Employer Profile Service
 *
 * @author      TCSCODER
 * @version     1.0
 */

const joi = require('joi');
const errors = require('common-errors');
const _ = require('lodash');
const models = require('../models');
const helper = require('../common/helper');
const co = require('co');
const UserService = require('./UserService');

/**
 * the specializations Or StaffSchme
 */
const specializationsOrStaffSchme = joi.array().items(joi.object().keys({
  id: joi.id(),
  value: joi.string(),
})).default([]);

/**
 * the profile schema
 */
const profileSchema = joi.object().keys({
  id: joi.id(),
  userId: joi.id(),
  offices: joi.array().items({
    id: joi.id(),
    businessName: joi.string(),
    address: joi.address(),
  }).default([]),
  specializations: specializationsOrStaffSchme,
  otherSpecialization: joi.string(),
  areasToStaff: specializationsOrStaffSchme,
  otherAreasToStaff: joi.string(),
  website: joi.string(),
  contactPhone: joi.string(),
  contactEmail: joi.string().email(),
  preferredContactOption: joi.contactOption(),
  alternateContactOption: joi.contactOption(),
  schedule: joi.object().keys({
    id: joi.id(),
    mondayStart: joi.string(),
    mondayEnd: joi.time(),
    tuesdayStart: joi.time(),
    tuesdayEnd: joi.time(),
    wednesdayStart: joi.time(),
    wednesdayEnd: joi.time(),
    thursdayStart: joi.time(),
    thursdayEnd: joi.time(),
    fridayStart: joi.time(),
    fridayEnd: joi.time(),
    saturdayStart: joi.time(),
    saturdayEnd: joi.time(),
    sundayStart: joi.time(),
    sundayEnd: joi.time(),
    employerProfileId: joi.id(),
  }),
  officeManagers: joi.array().items(joi.object().keys({
    id: joi.id(),
    firstName: joi.string(),
    lastName: joi.string(),
    email: joi.string().email(),
    employerProfileId: joi.id(),
    permissions: joi.array().items(joi.object().keys({
      id: joi.id(),
      value: joi.string(),
    })).default([]),
  })).default([]),
  employeeOrganization: joi.object().keys({
    id: joi.id(),
    employerProfileId: joi.id(),
    root: joi.object().keys({
      id: joi.id(),
      title: joi.string(),
      number: joi.number().integer(),
      children: joi.array().items(joi.object()),
    }),
  }),
  officeCultureDescription: joi.string(),
  facebookReviewsLink: joi.string(),
  googleReviewsLink: joi.string(),
  yelpReviewsLink: joi.string(),
  photos: joi.array().items(joi.photo()),
  profileQuestionAnswers: joi.profileQuestionAnswers(),
  accountType: joi.string().valid(_.values(models.Const.AccountType)),
  businessName: joi.string(),
  createdAt: joi.date(),
  updatedAt: joi.date(),
}).required();


/**
 * convert sequelize entity to swagger json object
 * @param entity
 * @return {Object}
 */
function toObject(entity) {
  let doc = _.extend({}, entity);

  doc = _.omit(doc, 'scheduleId', 'employeeOrganizationId');

  doc.offices = _.map(doc.offices, (o) => {
    const office = _.omit(o, 'EmployerOffices', 'addressId');
    office.address = _.omit(office.address, 'localityId');
    return office;
  });

  doc.specializations = _.map(doc.specializations, s => _.omit(s, 'EmployerSpecializations'));
  doc.areasToStaff = _.map(doc.areasToStaff, s => _.omit(s, 'EmployerOccupations'));
  doc.photos = _.map(doc.photos, p => _.omit(p, 'EmployerPhotos'));

  doc.officeManagers = _.map(doc.officeManagers, (m) => {
    const manager = _.omit(m, 'EmployerOfficeManagers');
    manager.permissions = _.map(manager.permissions, p => _.omit(p, 'OfficeManagerPermissions'));
    return manager;
  });

  doc.profileQuestionAnswers = _.map(doc.profileQuestionAnswers, (m) => {
    const answer = _.omit(m, 'EmployerProfileQuestionAnswers');
    answer.selectedAnswerOptions = _.map(answer.selectedAnswerOptions, p => _.omit(p, 'SelectedAnswerOptions'));
    return answer;
  });
  doc.employeeOrganization = _.omit(doc.employeeOrganization, 'rootId');

  return doc;
}

/**
 * create or update offices entity
 * of cause include address and locality
 * @param officeEntities
 * @return {Array}
 */
function* createOrUpdateOffices(officeEntities) {
  const offices = [];
  for (let i = 0; i < officeEntities.length; i += 1) {
    const officeEntity = officeEntities[i];
    if (officeEntity.address) {
      if (officeEntity.address.locality) {
        const locality = yield helper.createOrUpdate(models.Locality, officeEntity.address.locality);
        officeEntity.address.localityId = locality.id;
      }
      const address = yield helper.createOrUpdate(models.OfficeAddress, officeEntity.address);
      officeEntity.addressId = address.id;
    }
    const office = yield helper.createOrUpdate(models.Office, officeEntity);
    offices.push(office.id);
  }
  return offices;
}


/**
 * create or update office managers
 * @param managerEntities
 * @param employerId the employer Id
 * @return {Array} the managers id
 */
function* createOrUpdateOfficeManagers(managerEntities, employerId) {
  const managers = [];
  for (let i = 0; i < managerEntities.length; i += 1) {
    const managerEntity = managerEntities[i];
    const permissions = [];
    for (let j = 0; j < managerEntity.permissions.length; j += 1) {
      permissions.push((yield helper.createOrUpdate(models.AdministratorPermission, managerEntity.permissions[j])).id);
    }
    let manager = yield helper.createOrUpdate(models.OfficeManager, _.extend(managerEntity, { employerProfileId: employerId }));
    manager = yield models.OfficeManager.findOne({ where: { id: manager.id } });
    yield manager.addPermissions(permissions);
    managers.push(manager.id);
  }
  return managers;
}

/**
 * create or update ProfileQuestionAnswers
 * @param answerEntities the ProfileQuestionAnswer entities
 * @param addition the addition entity , like {employerProfileId:} or {employeeProfileId}
 * @return {Array} the answers id
 */
function* createOrUpdateProfileQuestionAnswers(answerEntities, addition) {
  const answers = [];
  for (let i = 0; i < answerEntities.length; i += 1) {
    const answerEntity = _.extend(answerEntities[i], addition);
    const options = [];
    for (let j = 0; j < answerEntity.selectedAnswerOptions.length; j += 1) {
      options.push((yield helper.createOrUpdate(models.QuestionAnswerOption, answerEntity.selectedAnswerOptions[j])).id);
    }
    let answer = yield helper.createOrUpdate(models.ProfileQuestionAnswer, answerEntity);
    answer = yield models.ProfileQuestionAnswer.findOne({ where: answer.id });
    answer.addSelectedAnswerOptions(options);
    answers.push(answer.id);
  }
  return answers;
}

/**
 * create or update EmployeeOrganization
 * @param entity
 */
function* createOrUpdateEmployeeOrganization(entity) {
  /**
   * build EmployeeOrganizationEmployee Tree
   */
  function* buildOrganizationEmployeeTree(root) {
    let node = yield helper.createOrUpdate(models.EmployeeOrganizationEmployee, root);
    if (root.children && root.children.length > 0) {
      const childrenIds = [];
      for (let i = 0; i < root.children.length; i += 1) {
        childrenIds.push(yield buildOrganizationEmployeeTree(root.children[i]));
      }
      node = yield models.EmployeeOrganizationEmployee.findOne({ where: { id: node.id } });
      node.setChildren(childrenIds);
      return node.id;
    }
    return node.id;
  }

  if (entity.root) {
    entity.rootId = yield buildOrganizationEmployeeTree(entity.root);
  }
  return yield helper.createOrUpdate(models.EmployeeOrganization, entity);
}

/**
 * create or update profile
 * @param entity the profile entity
 * @param type 'create' or 'update'
 */
function* createOrUpdateProfile(entity, type) {
  return yield models.sequelize.transaction(() => co(function* () {
    let employer = null;
    if (type === 'update') {
      yield models.EmployerProfile.update(entity, { where: { id: entity.id } });
      employer = yield models.EmployerProfile.findOne({ where: { id: entity.id } });
    } else {
      employer = yield models.EmployerProfile.create(entity);
    }


    if (entity.schedule) {
      entity.schedule.employerUserId = entity.userId;
      entity.scheduleId = (yield helper.createOrUpdate(models.Schedule, entity.schedule)).id;
    }

    if (entity.employeeOrganization) {
      entity.employeeOrganization.employerProfileId = employer.id;
      entity.employeeOrganizationId = (yield createOrUpdateEmployeeOrganization(entity.employeeOrganization)).id;
    }

    const offices = yield createOrUpdateOffices(entity.offices);
    const specializations = yield helper.createOrUpdateArrayItems(
      models.Specialization, entity.specializations); // create specializations
    const areasToStaff = yield helper.createOrUpdateArrayItems(
      models.Occupation, entity.areasToStaff); // areasToStaff
    const managers = yield createOrUpdateOfficeManagers(entity.officeManagers, employer.id);
    const photos = yield helper.createOrUpdateArrayItems(models.Photo, entity.photos);
    const answers = yield createOrUpdateProfileQuestionAnswers(entity.profileQuestionAnswers, { employerProfileId: employer.id });


    yield models.EmployerProfile.update(entity, { where: { id: employer.id } });
    yield employer.setOffices(offices); // add offices
    yield employer.setSpecializations(specializations);
    yield employer.setAreasToStaff(areasToStaff);
    yield employer.setOfficeManagers(managers);
    yield employer.setPhotos(photos);
    yield employer.setProfileQuestionAnswers(answers);
    yield UserService.updateUserTypes(entity.userId, [models.Const.UserType.employer], []);
    return yield get(employer.id);
  }));
}

/**
 * create Employer Profile
 * @param entity
 * @return {*}
 */
function* create(entity) {
  const profile = yield models.EmployerProfile.findOne({
    where: {
      userId: entity.userId,
      status: models.Const.ProfileStatus.active,
    },
    attributes: ['id'],
  });
  if (profile) {
    throw new errors.NotPermittedError('you can only create one EmployerProfile.');
  }

  entity.status = models.Const.ProfileStatus.active;
  return yield createOrUpdateProfile(entity, 'create');
}

create.schema = { entity: profileSchema };

/**
 * update profile by id and entity
 * @param id the profile id
 * @param entity
 */
function* update(id, entity) {
  const obj = yield get(id);
  if (obj.userId !== entity.userId) {
    throw new errors.NotPermittedError('cannot update profile that not belongs to you!');
  }
  const newEntity = _.merge(obj, entity);
  return yield createOrUpdateProfile(newEntity, 'update');
}

update.schema = { id: joi.id(), entity: profileSchema };

/**
 * get db entity by id
 * @param id
 * @return {*}
 */
function* getEntityById(id) {
  const entity = yield models.EmployerProfile.findOne({
    where: { id, status: models.Const.ProfileStatus.active },
    include: [
      {
        model: models.Office,
        as: 'offices',
        include: [{ model: models.OfficeAddress, as: 'address', include: [{ model: models.Locality, as: 'locality' }] }],
      },
      { model: models.Specialization, as: 'specializations' },
      { model: models.Occupation, as: 'areasToStaff' },
      { model: models.Schedule, as: 'schedule' },
      { model: models.Photo, as: 'photos' },
      {
        model: models.OfficeManager,
        as: 'officeManagers',
        include: [{ model: models.AdministratorPermission, as: 'permissions' }],
      },
      {
        model: models.ProfileQuestionAnswer,
        as: 'profileQuestionAnswers',
        include: [{ model: models.QuestionAnswerOption, as: 'selectedAnswerOptions' }],
      },
      {
        model: models.EmployeeOrganization,
        as: 'employeeOrganization',
        include: [{
          model: models.EmployeeOrganizationEmployee,
          as: 'root',
          include: [{ model: models.EmployeeOrganizationEmployee, as: 'children' }],
        }],
      },
    ],
  });

  if (!entity) {
    throw new errors.NotFoundError(`cannot found employerProfile where id = ${id}`);
  }
  return entity;
}

/**
 * use dfs to algorithm query OrganizationEmployee Tree
 * @param rootId
 * @return {*}
 */
function* queryOrganizationEmployeeTree(rootId) {
  const root = (yield models.EmployeeOrganizationEmployee.findOne({
    where: { id: rootId }, include: [{ model: models.EmployeeOrganizationEmployee, as: 'children' }],
  })).toJSON();

  if (root.children && root.children.length > 0) {
    for (let i = 0; i < root.children.length; i += 1) {
      root.children[i] = yield queryOrganizationEmployeeTree(root.children[i].id);
    }
    return root;
  }
  return root;
}

/**
 * get profile by id
 * @param id
 * @return {Object}
 */
function* get(id) {
  let entity = yield getEntityById(id);
  entity = entity.toJSON();
  if (entity.employeeOrganization && entity.employeeOrganization.rootId) {
    entity.employeeOrganization.root = yield queryOrganizationEmployeeTree(entity.employeeOrganization.rootId);
  }
  return toObject(entity);
}


/**
 * remove profile by id
 * @param id
 */
function* remove(id) {
  const entity = yield get(id);
  yield UserService.updateUserTypes(entity.userId, [], [models.Const.UserType.employer]);
  yield models.EmployerProfile.update({ status: models.Const.ProfileStatus.deleted }, { where: { id } });
}

/**
 * get profile by user id
 * @param query the query params
 * @return {*}
 */
function* getByUserId(query) {
  const e = yield models.EmployerProfile.findOne({
    where: {
      userId: query.userId,
      status: models.Const.ProfileStatus.active,
    },
  });
  if (!e) {
    throw new errors.NotFoundError('this user not create EmployerProfile yet.');
  }
  return yield get(e.id);
}

getByUserId.schema = {
  query: joi.object().keys({
    userId: joi.id().required(),
  }).default({}),
};

/**
 * export toObject function to function * for other service
 * @param entity
 * @return {Object}
 */
function* exportToObject(entity) {
  return toObject(entity);
}

module.exports = {
  create,
  update,
  get,
  remove,
  getByUserId,
  createOrUpdateProfileQuestionAnswers,
  exportToObject,
};
