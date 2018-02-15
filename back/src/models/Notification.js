/**
 * Copyright (C) 2017 TopCoder Inc., All Rights Reserved.
 */

/**
 * the Notification schema
 *
 * @author      TCSCODER
 * @version     1.0
 */


module.exports = (sequelize, DataTypes) => sequelize.define('Notification', {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  type: DataTypes.ENUM('friendshipRequest', 'like', 'match', 'benchMatch', 'phoneInterviewRequest', 'message'),
  text: DataTypes.STRING,
  recipientUserId: DataTypes.BIGINT,
  sourceUserId: DataTypes.BIGINT,
  entityId: DataTypes.BIGINT,
  status: DataTypes.ENUM('new', 'viewed', 'deleted'),
}, {});
