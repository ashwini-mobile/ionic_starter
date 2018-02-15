/**
 * Copyright (C) 2017 TopCoder Inc., All Rights Reserved.
 */

/**
 * the FaceBook login method schema
 *
 * @author      TCSCODER
 * @version     1.0
 */

module.exports = (sequelize, DataTypes) => sequelize.define('FaceBook', {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  facebookId: DataTypes.STRING,
  email: DataTypes.STRING,
  username: DataTypes.STRING,
}, {
  timestamps: false,
});
