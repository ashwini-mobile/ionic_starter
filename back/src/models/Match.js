/**
 * Copyright (C) 2017 TopCoder Inc., All Rights Reserved.
 */

/**
 * the Match schema
 *
 * @author      TCSCODER
 * @version     1.0
 */


module.exports = (sequelize, DataTypes) => sequelize.define('Match', {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
}, {});
