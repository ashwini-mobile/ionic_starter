/**
 * Copyright (C) 2017 TopCoder Inc., All Rights Reserved.
 */

/**
 * the Specialization schema
 *
 * @author      TCSCODER
 * @version     1.0
 */


module.exports = (sequelize, DataTypes) => sequelize.define('Specialization', {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  numInList: DataTypes.INTEGER,
  value: DataTypes.STRING,
}, {
  timestamps: false,
});
