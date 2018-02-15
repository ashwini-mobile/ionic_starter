/**
 * Copyright (C) 2017 TopCoder Inc., All Rights Reserved.
 */

/**
 * the EmployeeOrganization schema
 *
 * @author      TCSCODER
 * @version     1.0
 */


module.exports = (sequelize, DataTypes) => sequelize.define('EmployeeOrganization', {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  employerProfileId: DataTypes.BIGINT,
}, {
  timestamps: false,
});
