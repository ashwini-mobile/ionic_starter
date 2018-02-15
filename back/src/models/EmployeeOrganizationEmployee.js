/**
 * Copyright (C) 2017 TopCoder Inc., All Rights Reserved.
 */

/**
 * the EmployeeOrganizationEmployee schema
 *
 * @author      TCSCODER
 * @version     1.0
 */


module.exports = (sequelize, DataTypes) => sequelize.define('EmployeeOrganizationEmployee', {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  number: DataTypes.INTEGER,
  title: DataTypes.STRING,
}, {
  timestamps: false,
});
