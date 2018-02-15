/**
 * Copyright (C) 2017 TopCoder Inc., All Rights Reserved.
 */

/**
 * the Endorsement schema
 *
 * @author      TCSCODER
 * @version     1.0
 */


module.exports = (sequelize, DataTypes) => sequelize.define('Endorsement', {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  firstName: DataTypes.STRING,
  lastName: DataTypes.STRING,
  email: DataTypes.STRING,
  requestorUserId: DataTypes.BIGINT,
  status: DataTypes.ENUM('requested', 'completed'),
  endorsementText: DataTypes.STRING,
}, {});
