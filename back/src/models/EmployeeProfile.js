/**
 * Copyright (C) 2017 TopCoder Inc., All Rights Reserved.
 */

/**
 * the EmployeeProfile schema
 *
 * @author      TCSCODER
 * @version     1.0
 */


module.exports = (sequelize, DataTypes) => sequelize.define('EmployeeProfile', {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  userId: DataTypes.BIGINT,
  dateOfBirth: DataTypes.DATE,

  aboutMe: DataTypes.STRING,
  status: { type: DataTypes.ENUM('active', 'deleted'), defaultValue: 'active' },
  yearsOfExperience: DataTypes.INTEGER,
  industryId: DataTypes.STRING,
}, {});
