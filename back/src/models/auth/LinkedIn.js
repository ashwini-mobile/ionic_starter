/**
 * Copyright (C) 2017 TopCoder Inc., All Rights Reserved.
 */

/**
 * the linkedIn login method
 *
 * @author      TCSCODER
 * @version     1.0
 */


module.exports = (sequelize, DataTypes) => sequelize.define('LinkedIn', {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  linkedInId: DataTypes.STRING,
  email: DataTypes.STRING,
  username: DataTypes.STRING,
}, {
  timestamps: false,
});
