/**
 * Copyright (C) 2017 TopCoder Inc., All Rights Reserved.
 */

/**
 * the Interview schema
 *
 * @author      TCSCODER
 * @version     1.0
 */


module.exports = (sequelize, DataTypes) => sequelize.define('Interview', {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  date: DataTypes.DATE,
  message: DataTypes.STRING,
  requestorUserId: DataTypes.BIGINT,
  targetUserId: DataTypes.BIGINT,
  status: DataTypes.ENUM('requested', 'confirmed', 'completed'),
}, {});
