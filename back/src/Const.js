/**
 * Copyright (C) 2017 Topcoder Inc., All Rights Reserved.
 */


/**
 * the enum types
 *
 * @author      TCSCODER
 * @version     1.0
 */


const PhotoType = { regular: 'regular', profile: 'profile' };
const ContactOption = { email: 'email', phone: 'phone' };
const AccountType = { free: 'free', paid: 'paid' };
const RequestStatus = { new: 'new', answered: 'answered' };
const UserType = { employer: 'employer', employee: 'employee' };
const ProfileStatus = { active: 'active', deleted: 'deleted' };
const AvailabiltyType = { full: 'full', partTime: 'partTime' };
const Degree = { bachelor: 'bachelor', master: 'master', doctor: 'doctor' };
module.exports = {
  PhotoType,
  ContactOption,
  AccountType,
  ProfileStatus,
  AvailabiltyType,
  Degree,
  UserType,
  RequestStatus,
};
