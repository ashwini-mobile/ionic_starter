/**
 * Copyright (C) 2017 TopCoder Inc., All Rights Reserved.
 */

/**
 * the sequelize schema index
 *
 * @author      TCSCODER
 * @version     1.0
 */


const Const = require('../Const');
const sequelize = require('../datasource').getSequelize();
const DataTypes = require('sequelize/lib/data-types');


const User = require('./User')(sequelize, DataTypes);
const Google = require('./auth/Google')(sequelize, DataTypes);
const LinkedIn = require('./auth/LinkedIn')(sequelize, DataTypes);
const Facebook = require('./auth/FaceBook')(sequelize, DataTypes);
const Local = require('./auth/Local')(sequelize, DataTypes);
const AdministratorPermission = require('./AdministratorPermission')(sequelize, DataTypes);
const OfficeManager = require('./OfficeManager')(sequelize, DataTypes);
const Specialization = require('./Specialization')(sequelize, DataTypes);
const Occupation = require('./Occupation')(sequelize, DataTypes);
const OfficeAddress = require('./OfficeAddress')(sequelize, DataTypes);
const Office = require('./Office')(sequelize, DataTypes);
const Locality = require('./Locality')(sequelize, DataTypes);
const EmployerProfile = require('./EmployerProfile')(sequelize, DataTypes);
const Schedule = require('./Schedule')(sequelize, DataTypes);
const EmployeeOrganizationEmployee = require('./EmployeeOrganizationEmployee')(sequelize, DataTypes);
const EmployeeOrganization = require('./EmployeeOrganization')(sequelize, DataTypes);
const Photo = require('./Photo')(sequelize, DataTypes);
const Question = require('./Question')(sequelize, DataTypes);
const QuestionAnswerOption = require('./QuestionAnswerOption')(sequelize, DataTypes);
const ProfileQuestionAnswer = require('./ProfileQuestionAnswer')(sequelize, DataTypes);
const NotificationPreferences = require('./NotificationPreferences')(sequelize, DataTypes);
const EmployeeProfile = require('./EmployeeProfile')(sequelize, DataTypes);
const EmployerBench = require('./EmployerBench')(sequelize, DataTypes);
const EmployeeBench = require('./EmployeeBench')(sequelize, DataTypes);
const ContactUsMessage = require('./ContactUsMessage')(sequelize, DataTypes);
const LikeDislike = require('./LikeDislike')(sequelize, DataTypes);
const Match = require('./Match')(sequelize, DataTypes);
const FilterMatchingAnswer = require('./FilterMatchingAnswer')(sequelize, DataTypes);
const EmployeeSearchFilter = require('./EmployeeSearchFilter')(sequelize, DataTypes);
const EmployerSearchFilter = require('./EmployerSearchFilter')(sequelize, DataTypes);
const EmploymentRecord = require('./EmploymentRecord')(sequelize, DataTypes);
const EmployeeAvailability = require('./EmployeeAvailability')(sequelize, DataTypes);
const School = require('./School')(sequelize, DataTypes);
const SuggestionRequest = require('./SuggestionRequest')(sequelize, DataTypes);
const HelpRequest = require('./HelpRequest')(sequelize, DataTypes);

const belongsToMany = (source, target, through, as) => {
  source.belongsToMany(target, { through, timestamp: false, as });
};
const belongsTo = (source, target, as) => {
  source.belongsTo(target, { as });
};

belongsTo(User, Google, 'google');
belongsTo(User, LinkedIn, 'linkedIn');
belongsTo(User, Facebook, 'facebook');
belongsTo(User, Local, 'local');
belongsTo(OfficeAddress, Locality, 'locality');
belongsTo(Office, OfficeAddress, 'address');

belongsTo(EmployeeOrganization, EmployeeOrganizationEmployee, 'root');

belongsTo(EmploymentRecord, EmployerProfile, 'employerProfile');

belongsTo(Match, LikeDislike, 'firstLike');
belongsTo(Match, LikeDislike, 'secondLike');

belongsToMany(EmployerBench, EmployeeProfile, 'EmployerBenchEmployeeProfiles', 'employees');
belongsToMany(EmployeeBench, EmployerProfile, 'EmployeeBenchEmployerProfiles', 'employers');

belongsToMany(ProfileQuestionAnswer, QuestionAnswerOption, 'SelectedAnswerOptions', 'selectedAnswerOptions');
belongsToMany(FilterMatchingAnswer, QuestionAnswerOption, 'FilterMatchingAnswerOptions', 'matchingAnswerOptions');
belongsToMany(Question, QuestionAnswerOption, 'AnswerOptions', 'answerOptions');
belongsToMany(EmployeeOrganizationEmployee, EmployeeOrganizationEmployee,
  'EmployeeOrganizationEmployeeChildren', 'children');


belongsTo(EmployeeSearchFilter, Locality, 'closeTo');
belongsTo(EmployerSearchFilter, Locality, 'closeTo');

belongsToMany(OfficeManager, AdministratorPermission, 'OfficeManagerPermissions', 'permissions');
belongsToMany(EmployerProfile, Office, 'EmployerOffices', 'offices');
belongsToMany(EmployerProfile, Occupation, 'EmployerOccupations', 'areasToStaff');
belongsToMany(EmployerProfile, Specialization, 'EmployerSpecializations', 'specializations');
belongsToMany(EmployerProfile, OfficeManager, 'EmployerOfficeManagers', 'officeManagers');
belongsToMany(EmployerProfile, Photo, 'EmployerPhotos', 'photos');
belongsToMany(EmployerProfile, ProfileQuestionAnswer, 'EmployerProfileQuestionAnswers', 'profileQuestionAnswers');
belongsTo(EmployerProfile, Schedule, 'schedule');
belongsTo(EmployerProfile, EmployeeOrganization, 'employeeOrganization');


belongsTo(EmployeeProfile, Locality, 'employeeLocation');
belongsTo(EmployeeProfile, EmployeeAvailability, 'availability');
belongsTo(EmployeeProfile, Occupation, 'occupation');

belongsToMany(EmployeeProfile, EmploymentRecord, 'EmployeeEmploymentRecords', 'employementHistory');
belongsToMany(EmployeeProfile, School, 'EmployeeSchools', 'educationHistory');
belongsToMany(EmployeeProfile, Locality, 'PotentialEmployeeLocations', 'potentialEmployeeLocations');
belongsToMany(EmployeeProfile, ProfileQuestionAnswer, 'EmployeeProfileAnswers', 'profileQuestionAnswers');
belongsToMany(EmployeeProfile, Photo, 'EmployeePhotos', 'photos');


module.exports = {
  User,
  Google,
  Office,
  Locality,
  OfficeAddress,
  LinkedIn,
  Facebook,
  Local,
  EmployerProfile,
  EmployeeProfile,
  EmployeeSearchFilter,
  EmployerSearchFilter,
  EmployeeOrganization,
  AdministratorPermission,
  OfficeManager,
  Specialization,
  Occupation,
  ProfileQuestionAnswer,
  QuestionAnswerOption,
  Photo,
  EmploymentRecord,
  EmployeeOrganizationEmployee,
  SuggestionRequest,
  HelpRequest,
  EmployeeAvailability,
  NotificationPreferences,
  School,
  ContactUsMessage,
  Schedule,
  sequelize,
  Const,
};

module.exports.init = force => sequelize.sync({ force });
