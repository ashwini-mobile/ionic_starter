/**
 * Copyright (C) 2017 TopCoder Inc., All Rights Reserved.
 */

/**
 * the OfficeManager schema
 *
 * @author      TCSCODER
 * @version     1.0
 */


module.exports = (sequelize, DataTypes) => sequelize.define('OfficeManager', {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  firstName: DataTypes.STRING,
  lastName: DataTypes.STRING,
  employerProfileId: DataTypes.BIGINT,
  email: DataTypes.STRING,
}, {
  timestamps: false,
});
