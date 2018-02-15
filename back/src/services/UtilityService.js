/**
 * Copyright (C) 2017 TopCoder Inc., All Rights Reserved.
 */

/**
 * the Utility Service
 *
 * @author      TCSCODER
 * @version     1.0
 */


const config = require('config');
const joi = require('joi');
const _ = require('lodash');
const distance = require('google-distance');
const nodemailer = require('nodemailer');
const logger = require('../common/logger');

const transporter = nodemailer.createTransport(_.extend(config.email, { logger }), {
  from: `${config.email.auth.user}`,
});


/**
 * export Facebook Photos
 * @param userId
 * @returns {Array}
 */
function* exportFacebookPhotos(/* userId */) {
  // TODO not in scope for this challenge
  return [];
}


/**
 * get distance between two location
 * @param origin the origin location
 * @param destination the destination location
 * @returns {Promise}
 */
function* getDistance(origin, destination) {
  return new Promise((resolve, reject) => {
    distance.get(
      {
        origin,
        destination,
      },
      (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
  });
}

/**
 * get distances by batch mode
 * this will return an array of data objects corresponding to all origin/destination pairs.
 * @param origins {Array}
 * @param destinations {Array}
 * @returns {Promise}
 */
function* getDistances(origins, destinations) {
  return new Promise((resolve, reject) => {
    distance.get(
      {
        origins,
        destinations,
      },
      (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
  });
}

/**
 * send email to user
 * @param email the email entity ,  {to:,subject:,text:,html:}
 * @returns {Promise}
 */
function* sendEmail(emailEntity) {
  return new Promise((resolve, reject) => {
    transporter.sendMail(emailEntity, (err) => {
      if (err) {
        reject(err);
      } else {
        resolve();
      }
    });
  });
}
sendEmail.schema = {
  emailEntity: joi.object().keys({
    to: joi.string().email().required(),
    subject: joi.string().required(),
    text: joi.string().required(),
    html: joi.string(),
  }).required(),
};

module.exports = { exportFacebookPhotos, getDistance, getDistances, sendEmail };
