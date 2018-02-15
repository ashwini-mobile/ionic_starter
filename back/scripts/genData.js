/**
 * Copyright (C) 2017 TopCoder Inc., All Rights Reserved.
 */

/**
 * this script can use to make some random data
 * note: it will be drop all table and data , then create the new table
 *
 * @author      TCSCODER
 * @version     1.0
 */


const co = require('co');

require('../src/bootstrap');
const UserService = require('../src/services/UserService');
const EmployerProfileService = require('../src/services/EmployerProfileService');
const EmployeeProfileService = require('../src/services/EmployeeProfileService');
const HelpRequestService = require('../src/services/HelpRequestService');
const SuggestionRequestService = require('../src/services/SuggestionRequestService');
const EmployeeSearchFilterService = require('../src/services/EmployeeSearchFilterService');
const EmployerSearchFilterService = require('../src/services/EmployerSearchFilterService');

const models = require('../src/models');
const _ = require('lodash');

const logger = require('../src/common/logger');

const employerTpt = require('./data/employer.json');
const employeeTpt = require('./data/employee.json');

const addresses = ['2066-2070 University Avenue, Berkeley, CA 94704',
  'San Francisco, CA',
  'Los Angeles, CA',
  'Octavia Boulevard, San Francisco, CA 94102'];

/**
 * random element from array
 * @param arr
 */
const randomElement = arr => arr[Math.floor(Math.random() * arr.length)];


/**
 * create user , all users are be verified
 *
 * email: email0@email.com - email@email9.com
 * password: 123456
 * @returns {Array}
 */
function* createUsers() {
  const users = [];
  const password = yield UserService.generateHash('123456');
  for (let i = 0; i < 10; i += 1) {
    const local = yield models.Local.create({
      email: `email${i}@email.com`,
      username: `test${i}`,
      password,
      verified: true,
    });
    users.push((yield models.User.create({ localId: local.id })).id);
  }
  return users;
}

/**
 * create Employer Profiles
 * @param userIds
 * @returns {Array}
 */
function* createEmployerProfiles(userIds) {
  const employerids = [];
  for (let i = 0; i < userIds.length; i += 1) {
    const entity = _.extend({}, employerTpt,
      {
        userId: userIds[i],
        businessName: `business-work-0${i}`,
      });

    entity.profileQuestionAnswers = _.map(entity.profileQuestionAnswers, (h) => {
      h.employerProfileId = i + 1;
      return h;
    });

    _.each(entity.offices, (o) => {
      o.address.locality = {
        locality: randomElement(addresses),
        postalCode: '000111',
        state: 'USA',
      };
    });
    employerids.push((yield EmployerProfileService.create(entity)).id);
  }
  return employerids;
}

/**
 * create Employee Profiles
 * @param userIds
 * @param employerids
 * @returns {Array}
 */
function* createEmployeeProfiles(userIds, employerids) {
  const employeeids = [];
  for (let i = 0; i < userIds.length; i += 1) {
    const entity = _.extend({}, employeeTpt, { userId: userIds[i] });
    _.each(entity.employementHistory, (h) => {
      h.employerProfileId = employerids[i];
    });
    entity.employeeLocation = {
      locality: randomElement(addresses),
      postalCode: '000111',
      state: 'USA',
    };

    entity.educationHistory = _.map(entity.educationHistory, (h) => {
      h.degree = randomElement(_.values(models.Const.Degree));
      return h;
    });

    entity.profileQuestionAnswers = _.map(entity.profileQuestionAnswers, (h) => {
      h.employeeProfileId = i + 1;
      return h;
    });


    employeeids.push((yield EmployeeProfileService.create(entity)).id);
  }
  return employeeids;
}

/**
 * create HelpRequest and SugesstionRequest
 * @param userIds
 */
function* createRequest(userIds) {
  for (let i = 0; i < userIds.length; i += 1) {
    yield HelpRequestService.create({
      query: 'query-values-HelpRequest',
      email: `email${i}@email.com`,
      requestorUserId: userIds[i],
    });
    yield SuggestionRequestService.create({
      query: 'query-values-SuggestionRequest',
      email: `email${i}@email.com`,
      requestorUserId: userIds[i],
    });
  }
}


/**
 * create Search Fileter
 * @param userIds
 */
function* createSearchFileter(userIds) {
  for (let i = 0; i < userIds.length; i += 1) {
    yield EmployeeSearchFilterService.create({
      name: `employee-filter${i}`,
      userId: userIds[i],
      distance: Math.floor(Math.random() * 1000),
      degree: randomElement(_.values(models.Const.Degree)),
      closeTo: {
        locality: randomElement(addresses),
        state: 'USA',
        postalCode: '123123',
      },
    });

    yield EmployerSearchFilterService.create({
      name: `employer-filter${i}`,
      userId: userIds[i],
      distance: Math.floor(Math.random() * 1000),
      degree: randomElement(_.values(models.Const.Degree)),
      employerName: '0',
      closeTo: {
        locality: randomElement(addresses),
        state: 'USA',
        postalCode: '123123',
      },
    });
  }
}


co(function* () {
  yield models.init(true);

  const userIds = yield createUsers();
  yield createRequest(userIds);
  yield createSearchFileter(userIds);
  const employerids = yield createEmployerProfiles(userIds);
  yield createEmployeeProfiles(userIds, employerids);
  logger.info('succeed!');
  process.exit(0);
}).catch((err) => {
  logger.error(err);
  logger.info('got error, program will exit');
  process.exit(1);
});

