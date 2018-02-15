/**
 * Copyright (C) 2017 TopCoder Inc., All Rights Reserved.
 */

/**
 * the SuggestionRequest schema
 *
 * @author      TCSCODER
 * @version     1.0
 */


module.exports = (sequelize, DataTypes) => sequelize.define('SuggestionRequest', {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  query: DataTypes.STRING,
  email: DataTypes.STRING,
  requestorUserId: DataTypes.STRING,
  status: DataTypes.ENUM('new', 'answered'),
}, {});
