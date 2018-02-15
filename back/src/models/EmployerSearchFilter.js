/**
 * Copyright (C) 2017 TopCoder Inc., All Rights Reserved.
 */

/**
 * the EmployerSearchFilter schema
 *
 * @author      TCSCODER
 * @version     1.0
 */


module.exports = (sequelize, DataTypes) => sequelize.define('EmployerSearchFilter', {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  userId: DataTypes.BIGINT,
  name: DataTypes.STRING,
  degree: DataTypes.ENUM('bachelor', 'master', 'doctor'),
  occupationId: DataTypes.BIGINT,
  distance: DataTypes.INTEGER,
  employerName: DataTypes.STRING,
  answers: { type: DataTypes.STRING, defaultValue: '[]' },
}, {
  timestamps: false,
});
