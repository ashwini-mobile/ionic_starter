/**
 * Copyright (C) 2017 TopCoder Inc., All Rights Reserved.
 */

/**
 * the School schema
 *
 * @author      TCSCODER
 * @version     1.0
 */


module.exports = (sequelize, DataTypes) => sequelize.define('School', {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  name: DataTypes.STRING,
  degree: DataTypes.ENUM('bachelor', 'master', 'doctor'),
  startDate: DataTypes.DATE,
  endDate: DataTypes.DATE,
  activitiesAndSocieties: DataTypes.STRING,
  description: DataTypes.STRING,
}, { timestamps: false });
