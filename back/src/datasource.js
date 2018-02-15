/**
 * Copyright (C) 2017 Topcoder Inc., All Rights Reserved.
 */


/**
 * Init  datasource
 *
 * @author      TCSCODER
 * @version     1.0
 */

const config = require('config');
const Sequelize = require('sequelize');
const logger = require('./common/logger');

Sequelize.Promise = global.Promise;
let sequelizeInstance = null;


/**
 *  get mysql sequelize instance
 * @returns {*}
 */
function getSequelize() {
  if (sequelizeInstance === null) {
    sequelizeInstance = new Sequelize(
      config.db.uri,
      config.db.options,
    );
    sequelizeInstance
      .authenticate()
      .then(() => {
        logger.info('Connection has been established successfully.');
      })
      .catch((err) => {
        logger.error('Unable to connect to the database:', err);
      });
  }
  return sequelizeInstance;
}

module.exports = {
  getSequelize,
};
