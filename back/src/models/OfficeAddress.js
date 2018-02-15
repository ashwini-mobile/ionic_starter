/**
 * Copyright (C) 2017 TopCoder Inc., All Rights Reserved.
 */

/**
 * the OfficeAddress schema
 *
 * @author      TCSCODER
 * @version     1.0
 */


module.exports = (sequelize, DataTypes) => sequelize.define('OfficeAddress', {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  street: DataTypes.STRING,
}, {
  timestamps: false,
});
