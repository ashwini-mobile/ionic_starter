/**
 * Copyright (C) 2017 TopCoder Inc., All Rights Reserved.
 */

/**
 * the Question schema
 *
 * @author      TCSCODER
 * @version     1.0
 */


module.exports = (sequelize, DataTypes) => sequelize.define('Question', {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  title: DataTypes.STRING,
  text: DataTypes.STRING,
  multiOption: DataTypes.BOOLEAN,
  number: DataTypes.INTEGER,
  type: DataTypes.ENUM('entry', 'employeeProfile', 'employerProfile'),
}, {
  timestamps: false,
});
