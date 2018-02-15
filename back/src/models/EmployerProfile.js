/**
 * Copyright (C) 2017 TopCoder Inc., All Rights Reserved.
 */

/**
 * the EmployerProfile schema
 *
 * @author      TCSCODER
 * @version     1.0
 */


module.exports = (sequelize, DataTypes) => sequelize.define('EmployerProfile', {
  id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
  userId: DataTypes.BIGINT,
  businessName: DataTypes.STRING,
  otherSpecialization: DataTypes.STRING,
  otherAreaToStaff: DataTypes.STRING,
  website: DataTypes.STRING,
  contactEmail: DataTypes.STRING,
  contactPhone: DataTypes.STRING,
  preferredContactOption: DataTypes.ENUM('phone', 'email'),
  alternateContactOption: DataTypes.ENUM('phone', 'email'),

  officeCultureDescription: DataTypes.STRING,
  facebookReviewsLink: DataTypes.STRING,
  googleReviewsLink: DataTypes.STRING,
  yelpReviewsLink: DataTypes.STRING,

  accountType: DataTypes.ENUM('free', 'paid'),
  status: { type: DataTypes.ENUM('active', 'deleted'), defaultValue: 'active' },
  industryId: DataTypes.STRING,
}, {});
