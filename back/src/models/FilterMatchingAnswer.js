/**
 * Copyright (C) 2017 TopCoder Inc., All Rights Reserved.
 */

/**
 * the FilterMatchingAnswer schema
 *
 * @author      TCSCODER
 * @version     1.0
 */


module.exports = (sequelize, DataTypes) => sequelize.define('FilterMatchingAnswer', {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  questionId: DataTypes.BIGINT,
}, {
  timestamps: false,
});
