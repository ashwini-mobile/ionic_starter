/**
 * Copyright (C) 2017 TopCoder Inc., All Rights Reserved.
 */

/**
 * the google login method schema
 *
 * @author      TCSCODER
 * @version     1.0
 */


module.exports = (sequelize, DataTypes) => sequelize.define('Google', {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  googleId: DataTypes.STRING,
  email: DataTypes.STRING,
  username: DataTypes.STRING,
}, {
  timestamps: false,
});
