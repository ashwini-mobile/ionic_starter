/**
 * Copyright (C) 2017 TopCoder Inc., All Rights Reserved.
 */

/**
 * the Office schema
 *
 * @author      TCSCODER
 * @version     1.0
 */


module.exports = (sequelize, DataTypes) => sequelize.define('Office', {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  businessName: DataTypes.STRING,
}, {
  timestamps: false,
});
