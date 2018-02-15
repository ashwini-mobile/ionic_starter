/**
 * Copyright (C) 2017 TopCoder Inc., All Rights Reserved.
 */

/**
 * the ProfileQuestionAnswer schema
 *
 * @author      TCSCODER
 * @version     1.0
 */


module.exports = (sequelize, DataTypes) => sequelize.define('ProfileQuestionAnswer', {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  employeeProfileId: DataTypes.BIGINT,
  employerProfileId: DataTypes.BIGINT,
  questionId: DataTypes.BIGINT,
  otherAnswer: DataTypes.STRING,
}, {
  timestamps: false,
});
