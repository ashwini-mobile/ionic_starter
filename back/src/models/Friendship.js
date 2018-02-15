/**
 * Copyright (C) 2017 TopCoder Inc., All Rights Reserved.
 */

/**
 * the Friendship schema
 *
 * @author      TCSCODER
 * @version     1.0
 */


module.exports = (sequelize, DataTypes) => sequelize.define('Friendship', {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  requestorUserId: DataTypes.BIGINT,
  targetUserId: DataTypes.BIGINT,
  status: DataTypes.ENUM('confirmed', 'requested'),
}, {});
