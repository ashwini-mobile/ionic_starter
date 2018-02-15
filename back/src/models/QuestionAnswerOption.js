/**
 * Copyright (C) 2017 TopCoder Inc., All Rights Reserved.
 */

/**
 * the QuestionAnswerOption schema
 *
 * @author      TCSCODER
 * @version     1.0
 */


module.exports = (sequelize, DataTypes) => sequelize.define('QuestionAnswerOption', {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  value: DataTypes.STRING,
  questionId: DataTypes.BIGINT,
}, {
  timestamps: false,
});
