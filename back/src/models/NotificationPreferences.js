/**
 * Copyright (C) 2017 TopCoder Inc., All Rights Reserved.
 */

/**
 * the NotificationPreferences schema
 *
 * @author      TCSCODER
 * @version     1.0
 */


module.exports = (sequelize, DataTypes) => sequelize.define('NotificationPreferences', {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  userId: DataTypes.BIGINT,
  messages: DataTypes.BOOLEAN,
  friendRequests: DataTypes.BOOLEAN,
  phoneInterviewRequest: DataTypes.BOOLEAN,
  match: DataTypes.BOOLEAN,
  benchMatch: DataTypes.BOOLEAN,
}, {
  timestamps: false,
});
