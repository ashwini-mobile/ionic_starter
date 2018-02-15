/**
 * Copyright (C) 2017 TopCoder Inc., All Rights Reserved.
 */

/**
 * the Message schema
 *
 * @author      TCSCODER
 * @version     1.0
 */


module.exports = (sequelize, DataTypes) => sequelize.define('Message', {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  text: DataTypes.STRING,
  senderUserId: DataTypes.BIGINT,
  recipientUserId: DataTypes.BIGINT,
  status: DataTypes.ENUM('new', 'viewed', 'deleted'),
}, {});
