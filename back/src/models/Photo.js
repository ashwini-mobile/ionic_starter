/**
 * Copyright (C) 2017 TopCoder Inc., All Rights Reserved.
 */

/**
 * the Photo schema
 *
 * @author      TCSCODER
 * @version     1.0
 */


module.exports = (sequelize, DataTypes) => sequelize.define('Photo', {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  url: DataTypes.STRING,
  type: DataTypes.ENUM('profile', 'regular'),
}, {});
