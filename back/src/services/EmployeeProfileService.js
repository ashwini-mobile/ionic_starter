/**
 * Copyright (C) 2017 TopCoder Inc., All Rights Reserved.
 */

/**
 * the Employee Profile Service
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
const EmployerProfileService = require('./EmployerProfileService');
const UserService = require('./UserService');


const employeeProfileSchema = joi.object().keys({
  id: joi.id(),
  username: joi.string(),
  userId: joi.id(),
  dateOfBirth: joi.date(),
  employeeLocation: joi.locality(),
  availability: joi.object().keys({
    id: joi.id(),
    employeeProfileId: joi.id(),
    mondayStart: joi.time(),
    mondayEnd: joi.time(),
    mondayAvailabilityType: joi.availabiltyType(),
    tuesdayStart: joi.time(),
    tuesdayEnd: joi.time(),
    tuesdayAvailabilityType: joi.availabiltyType(),
    wednesdayStart: joi.time(),
    wednesdayEnd: joi.time(),
    wednesdayAvailabilityType: joi.availabiltyType(),
    thursdayStart: joi.time(),
    thursdayEnd: joi.time(),
    thursdayAvailabilityType: joi.availabiltyType(),
    fridayStart: joi.time(),
    fridayEnd: joi.time(),
    fridayAvailabilityType: joi.availabiltyType(),
    saturdayStart: joi.time(),
    saturdayEnd: joi.time(),
    saturdayAvailabilityType: joi.availabiltyType(),
    sundayStart: joi.time(),
    sundayEnd: joi.time(),
    sundayAvailabilityType: joi.availabiltyType(),
    employerUserId: joi.id(),
  }),
  employementHistory: joi.array().items(joi.object().keys({
    id: joi.id(),
    employerProfileId: joi.id(),
    otherEmployer: joi.string(),
    startDate: joi.date(),
    endDate: joi.date(),
  })).default([]),
  yearsOfExperience: joi.number().default(0),
  educationHistory: joi.array().items(joi.object().keys({
    id: joi.id(),
    name: joi.string(),
    degree: joi.degree(),
    startDate: joi.date(),
    endDate: joi.date(),
    activitiesAndSocieties: joi.string(),
    description: joi.string(),
  })).default([]),
  potentialEmployeeLocations: joi.array().items(joi.locality()).default([]),
  aboutMe: joi.string(),
  status: joi.string(),
  occupation: joi.object().keys({
    id: joi.id(),
    value: joi.string(),
  }),
  profileQuestionAnswers: joi.profileQuestionAnswers(),
  photos: joi.array().items(joi.photo()).default([]),
  createdAt: joi.date(),
  updatedAt: joi.date(),
}).required().min(1);


/**
 * create or update Employee profile
 * @param entity the entity
 * @param type 'create' or 'update'
 */
function* createOrUpdateEmployeeProfile(entity, type) {
  return yield models.sequelize.transaction(() => co(function* () {
    if (entity.employeeLocation) {
      entity.employeeLocationId = (yield helper.createOrUpdate(
        models.Locality, entity.employeeLocation)).id;
    }

    if (entity.availability) {
      entity.availabilityId = (yield helper.createOrUpdate(
        models.EmployeeAvailability, entity.availability)).id;
    }
    if (entity.occupation) {
      entity.occupationId = (yield helper.createOrUpdate(
        models.Occupation, entity.occupation)).id;
    }

    let employee = null;
    if (type === 'update') {
      yield models.EmployeeProfile.update(entity, { where: { id: entity.id } });
      employee = yield models.EmployeeProfile.findOne({ where: { id: entity.id } });
    } else {
      employee = yield models.EmployeeProfile.create(entity);
    }

    const employementHistory = yield helper.createOrUpdateArrayItems(models.EmploymentRecord, entity.employementHistory);
    const educationHistory = yield helper.createOrUpdateArrayItems(models.School, entity.educationHistory);
    const potentialEmployeeLocations = yield helper.createOrUpdateArrayItems(
      models.Locality, entity.potentialEmployeeLocations);
    const answers = yield EmployerProfileService.createOrUpdateProfileQuestionAnswers(
      entity.profileQuestionAnswers, { employeeProfileId: employee.id });
    const photos = yield helper.createOrUpdateArrayItems(models.Photo, entity.photos);


    if (entity.availabilityId) {
      yield models.EmployeeAvailability.update({ employerUserId: employee.id }, { where: { id: entity.availabilityId } });
    }
    yield employee.setEmployementHistory(employementHistory);
    yield employee.setEducationHistory(educationHistory);
    yield employee.setPotentialEmployeeLocations(potentialEmployeeLocations);
    yield employee.setPhotos(photos);
    yield employee.setProfileQuestionAnswers(answers);
    yield UserService.updateUserTypes(entity.userId, [models.Const.UserType.employee], []);
    return yield get(employee.id);
  }));
}

/**
 * create Employee Profile
 * @param entity
 * @return {*}
 */
function* create(entity) {
  const profile = yield models.EmployeeProfile.findOne({
    where: {
      userId: entity.userId,
      status: models.Const.ProfileStatus.active,
    },
    attributes: ['id'],
  });
  if (profile) {
    throw new errors.NotPermittedError('you can only create one EmployeeProfile.');
  }


  entity.status = models.Const.ProfileStatus.active;
  return yield createOrUpdateEmployeeProfile(entity, 'create');
}

create.schema = { entity: employeeProfileSchema };

/**
 * update EmployeeProfile
 * @param id the EmployeeProfile id
 * @param entity the EmployeeProfile entity
 */
function* update(userId, id, entity) {
  const obj = yield get(id);
  if (obj.userId !== userId) {
    throw new errors.NotPermittedError('cannot update profile that not belongs to you!');
  }
  const newEntity = _.merge(obj, entity);
  return yield createOrUpdateEmployeeProfile(newEntity, 'update');
}

/**
 * conver db entity to json object
 * @param entity
 */
function toObject(entity) {
  const doc = _.omit(entity, 'availabilityId', 'occupationId', 'employeeLocationId');
  doc.employementHistory = _.map(doc.employementHistory, h => _.omit(h, 'EmployeeEmploymentRecords'));
  doc.educationHistory = _.map(doc.educationHistory, h => _.omit(h, 'EmployeeSchools'));
  doc.educationHistory = _.map(doc.educationHistory, h => _.omit(h, 'EmployeeSchools'));
  doc.potentialEmployeeLocations = _.map(doc.potentialEmployeeLocations, h => _.omit(h, 'PotentialEmployeeLocations'));
  doc.potentialEmployeeLocations = _.map(doc.potentialEmployeeLocations, h => _.omit(h, 'PotentialEmployeeLocations'));
  doc.photos = _.map(doc.photos, h => _.omit(h, 'EmployeePhotos', 'updatedAt'));
  doc.profileQuestionAnswers = _.map(doc.profileQuestionAnswers, (m) => {
    const answer = _.omit(m, 'EmployeeProfileAnswers');
    answer.selectedAnswerOptions = _.map(answer.selectedAnswerOptions, p => _.omit(p, 'SelectedAnswerOptions'));
    return answer;
  });
  return doc;
}

/**
 * get user by id
 * @param id
 */
function* get(id) {
  const entity = yield models.EmployeeProfile.findOne({
    where: { id, status: models.Const.ProfileStatus.active },
    include: [
      { model: models.Locality, as: 'employeeLocation' },
      { model: models.EmployeeAvailability, as: 'availability' },
      { model: models.EmploymentRecord, as: 'employementHistory' },
      { model: models.School, as: 'educationHistory' },
      { model: models.Occupation, as: 'occupation' },
      { model: models.Locality, as: 'potentialEmployeeLocations' },
      { model: models.Photo, as: 'photos' },
      {
        model: models.ProfileQuestionAnswer,
        as: 'profileQuestionAnswers',
        include: [{ model: models.QuestionAnswerOption, as: 'selectedAnswerOptions' }],
      },
    ],
  });

  if (!entity) {
    throw new errors.NotFoundError(`cannot found EmployeeProfile where id = ${id}`);
  }

  return toObject(entity.toJSON());
}


/**
 * remove profile by id (soft delete)
 * @param id
 */
function* remove(id) {
  const entity = yield models.EmployeeProfile.findOne({
    where: { id, status: models.Const.ProfileStatus.active },
    attributes: ['id', 'userId'],
  });
  if (!entity) {
    throw new errors.NotFoundError(`cannot found EmployeeProfile where id = ${id}`);
  }

  yield UserService.updateUserTypes(entity.toJSON().userId, [], [models.Const.UserType.employee]);
  yield models.EmployeeProfile.update({ status: models.Const.ProfileStatus.deleted }, { where: { id } });
}

/**
 * get profile by user id
 * @param query the query params
 * @return {*}
 */
function* getByUserId(query) {
  const e = yield models.EmployeeProfile.findOne({
    where: {
      userId: query.userId,
      status: models.Const.ProfileStatus.active,
    },
  });

  if (!e) {
    throw new errors.NotFoundError('this user not create EmployeeProfile yet.');
  }
  return yield get(e.id);
}

getByUserId.schema = {
  query: joi.object().keys({
    userId: joi.id().required(),
  }).default({}),
};

/**
 * export * toObject to other service use
 * @param entity
 * @returns {*}
 */
function* exportToObject(entity) {
  return toObject(entity);
}

module.exports = { create, update, get, remove, getByUserId, exportToObject };
