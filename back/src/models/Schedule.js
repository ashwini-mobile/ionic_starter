/**
 * Copyright (C) 2017 TopCoder Inc., All Rights Reserved.
 */

/**
 * the Schedule schema
 *
 * @author      TCSCODER
 * @version     1.0
 */


module.exports = (sequelize, DataTypes) => sequelize.define('Schedule', {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  mondayStart: DataTypes.TIME,
  mondayEnd: DataTypes.TIME,
  tuesdayStart: DataTypes.TIME,
  tuesdayEnd: DataTypes.TIME,
  wednesdayStart: DataTypes.TIME,
  wednesdayEnd: DataTypes.TIME,
  thursdayStart: DataTypes.TIME,
  thursdayEnd: DataTypes.TIME,
  fridayStart: DataTypes.TIME,
  fridayEnd: DataTypes.TIME,
  saturdayStart: DataTypes.TIME,
  saturdayEnd: DataTypes.TIME,
  sundayStart: DataTypes.TIME,
  sundayEnd: DataTypes.TIME,
  employerUserId: DataTypes.BIGINT,
}, {
  timestamps: false,
});
