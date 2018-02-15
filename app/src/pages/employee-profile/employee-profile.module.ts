import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { EmployeeProfilePage } from './employee-profile';
import { SharedModule } from '../../app/shared.module';
import { DatePickerModule } from 'datepicker-ionic2';

@NgModule({
	declarations: [
		EmployeeProfilePage,
	],
	imports: [
		IonicPageModule.forChild(EmployeeProfilePage),
		SharedModule,
		DatePickerModule
	],
	exports: [
		EmployeeProfilePage,
	]
})
export class EmployeeProfilePageModule {}
