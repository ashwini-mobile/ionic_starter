/**
 * Copyright (C) 2017 TopCoder Inc., All Rights Reserved.
 */

/**
 * the EmploymentRecord schema
 *
 * @author      TCSCODER
 * @version     1.0
 */


module.exports = (sequelize, DataTypes) => sequelize.define('EmploymentRecord', {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  otherEmployer: DataTypes.STRING,
  startDate: DataTypes.DATE,
  endDate: DataTypes.DATE,
}, {
  timestamps: false,
});
