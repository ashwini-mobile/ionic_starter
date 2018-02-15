/**
 * Copyright (C) 2017 TopCoder Inc., All Rights Reserved.
 */

/**
 * the LikeDislike schema
 *
 * @author      TCSCODER
 * @version     1.0
 */


module.exports = (sequelize, DataTypes) => sequelize.define('LikeDislike', {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  like: DataTypes.BOOLEAN,
  requestorUserId: DataTypes.BIGINT,
  targetUserId: DataTypes.BIGINT,
}, {});
