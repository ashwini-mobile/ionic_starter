/**
 * Copyright (C) 2017 TopCoder Inc., All Rights Reserved.
 */

/**
 * the AdministratorPermission schema
 *
 * @author      TCSCODER
 * @version     1.0
 */


module.exports = (sequelize, DataTypes) => sequelize.define('AdministratorPermission', {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  value: DataTypes.STRING,
}, {
  timestamps: false,
});
