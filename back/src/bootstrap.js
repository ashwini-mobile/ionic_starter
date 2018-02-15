/**
 * Copyright (C) 2017 TopCoder Inc., All Rights Reserved.
 */

/**
 * add logger and joi to services
 *
 * @author      TCSCODER
 * @version     1.0
 */

global.Promise = require('bluebird');
const fs = require('fs');
const path = require('path');
const joi = require('joi');
const config = require('config');
const logger = require('./common/logger');
const _ = require('lodash');
const Const = require('./Const');

joi.pageIndex = () => joi.number().integer().min(0).default(0);
joi.pageSize = () => joi.number().integer().min(1).default(config.QUERY_MAX_LIMIT);
joi.id = () => joi.number().integer().min(1);
joi.time = () => joi.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/);
joi.photo = () => joi.object().keys({
  id: joi.id(),
  url: joi.string(),
  type: joi.string().valid(_.values(Const.PhotoType)),
  createdAt: joi.date(),
});

joi.contactOption = () => joi.string().valid(_.values(Const.ContactOption));
joi.availabiltyType = () => joi.string().valid(_.values(Const.AvailabiltyType));
joi.degree = () => joi.string().valid(_.values(Const.Degree));
joi.locality = () => joi.object().keys({
  id: joi.id(),
  locality: joi.string(),
  postalCode: joi.string(),
  state: joi.string(),
});

joi.address = () => joi.object().keys({
  id: joi.id(),
  street: joi.string(),
  locality: joi.locality(),
});
joi.requestStatus = () => joi.string().valid(_.values(Const.RequestStatus));

joi.profileQuestionAnswers = () => joi.array().items(joi.object().keys({
  id: joi.id(),
  employeeProfileId: joi.id(),
  employerProfileId: joi.id(),
  questionId: joi.id(),
  selectedAnswerOptions: joi.array().items(joi.object().keys({
    id: joi.id(),
    value: joi.string(),
    questionId: joi.id(),
  })).default([]),
  otherAnswer: joi.string(),
})).default([]);

joi.filterMatchingAnswers = () => joi.array().items(joi.object().keys({
  questionId: joi.id().required(),
  matchingAnswerOptions: joi.array().items(joi.id()).default([]),
})).default([]);

/**
 * add logger and joi schema to service
 * @param dir
 */
function buildServices(dir) {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const curPath = path.join(dir, file);
    fs.stat(curPath, (err, stats) => {
      if (err) return;
      if (stats.isDirectory()) {
        buildServices(curPath);
      } else if (path.extname(file) === '.js') {
        logger.buildService(require(curPath)); // eslint-disable-line
      }
    });
  });
}

buildServices(path.join(__dirname, 'services'));
