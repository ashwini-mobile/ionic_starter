/**
 * Copyright (C) 2017 TopCoder Inc., All Rights Reserved.
 */

/**
 * the Locality schema
 *
 * @author      TCSCODER
 * @version     1.0
 */


module.exports = (sequelize, DataTypes) => sequelize.define('Locality', {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  locality: DataTypes.STRING,
  postalCode: DataTypes.STRING,
  state: DataTypes.STRING,
}, {
  timestamps: false,
});
