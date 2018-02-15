/**
 * Copyright (C) 2017 TopCoder Inc., All Rights Reserved.
 */

/**
 * Defines the API routes
 *
 * @author      TCSCODER
 * @version     1.0
 */

const _ = require('lodash');
const UserRoutes = require('./UserRoutes');
const EmployeeProfileRoutes = require('./EmployeeProfileRoutes');
const EmployerProfileRoutes = require('./EmployerProfileRoutes');
const EmployerSearchFilterRoutes = require('./EmployerSearchFilterRoutes');
const EmployeeSearchFilterRoutes = require('./EmployeeSearchFilterRoutes');
const LookupRoutes = require('./LookupRoutes');
const SuggestionRequestRoutes = require('./SuggestionRequestRoutes');
const HelpRequestRoutes = require('./HelpRequestRoutes');

module.exports = _.extend({}, UserRoutes,
  EmployeeProfileRoutes, EmployerProfileRoutes,
  EmployerSearchFilterRoutes, EmployeeSearchFilterRoutes, LookupRoutes,
  SuggestionRequestRoutes, HelpRequestRoutes);
