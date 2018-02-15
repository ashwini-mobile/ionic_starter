/**
 * Copyright (C) 2017 TopCoder Inc., All Rights Reserved.
 */

/**
 * the EmployeeAvailability schema
 *
 * @author      TCSCODER
 * @version     1.0
 */


module.exports = (sequelize, DataTypes) => {
  const availabiltyType = DataTypes.ENUM('full', 'partTime');
  return sequelize.define('EmployeeAvailability', {
    id: { type: DataTypes.BIGINT, primaryKey: true, autoIncrement: true },
    mondayStart: DataTypes.TIME,
    mondayEnd: DataTypes.TIME,
    mondayAvailabilityType: availabiltyType,
    tuesdayStart: DataTypes.TIME,
    tuesdayEnd: DataTypes.TIME,
    tuesdayAvailabilityType: availabiltyType,

    wednesdayStart: DataTypes.TIME,
    wednesdayEnd: DataTypes.TIME,
    wednesdayAvailabilityType: availabiltyType,

    thursdayStart: DataTypes.TIME,
    thursdayEnd: DataTypes.TIME,
    thursdayAvailabilityType: availabiltyType,

    fridayStart: DataTypes.TIME,
    fridayEnd: DataTypes.TIME,
    fridayAvailabilityType: availabiltyType,

    saturdayStart: DataTypes.TIME,
    saturdayEnd: DataTypes.TIME,
    saturdayAvailabilityType: availabiltyType,

    sundayStart: DataTypes.TIME,
    sundayEnd: DataTypes.TIME,
    sundayAvailabilityType: availabiltyType,

    employerUserId: DataTypes.BIGINT,
  }, {
    timestamps: false,
  });
};
