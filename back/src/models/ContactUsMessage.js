/**
 * Copyright (C) 2017 TopCoder Inc., All Rights Reserved.
 */

/**
 * the ContactUsMessage schema
 *
 * @author      TCSCODER
 * @version     1.0
 */


module.exports = (sequelize, DataTypes) => sequelize.define('ContactUsMessage', {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  topic: DataTypes.STRING,
  query: DataTypes.STRING,
  email: DataTypes.STRING,
  requestorUserId: DataTypes.STRING,
  status: DataTypes.ENUM('new', 'answered'),
}, {});
