import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { ActivityPage } from './activity';
import { SharedModule } from '../../app/shared.module';

@NgModule({
	declarations: [
		ActivityPage,
	],
	imports: [
		IonicPageModule.forChild(ActivityPage),
		SharedModule,
	],
	exports: [
		ActivityPage,
	]
})
export class ActivityPageModule {}
