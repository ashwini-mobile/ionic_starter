/**
 * Copyright (C) 2017 TopCoder Inc., All Rights Reserved.
 */

/**
 * the EmployeeSearchFilter schema
 *
 * @author      TCSCODER
 * @version     1.0
 */


module.exports = (sequelize, DataTypes) => sequelize.define('EmployeeSearchFilter', {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  userId: DataTypes.BIGINT,
  name: DataTypes.STRING,
  occupationId: DataTypes.BIGINT,
  degree: DataTypes.ENUM('bachelor', 'master', 'doctor'),
  distance: DataTypes.INTEGER,
  answers: { type: DataTypes.STRING, defaultValue: '[]' },
}, {
  timestamps: false,
});
