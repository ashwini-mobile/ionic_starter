import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { EndorsementsPage } from './endorsements';
import { SharedModule } from '../../app/shared.module';

@NgModule({
	declarations: [
		EndorsementsPage,
	],
	imports: [
		IonicPageModule.forChild(EndorsementsPage),
		SharedModule,
	],
	exports: [
		EndorsementsPage,
	]
})
export class EndorsementsPageModule {}
