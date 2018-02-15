/**
 * Copyright (C) 2017 TopCoder Inc., All Rights Reserved.
 */


/**
 * the Local login schema
 *
 * @author      TCSCODER
 * @version     1.0
 */


module.exports = (sequelize, DataTypes) => sequelize.define('Local', {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  password: DataTypes.STRING,
  username: { type: DataTypes.STRING, allowNull: false },
  verified: { type: DataTypes.BOOLEAN, defaultValue: false },
  verificationToken: DataTypes.STRING,
}, {
  timestamps: false,
});
