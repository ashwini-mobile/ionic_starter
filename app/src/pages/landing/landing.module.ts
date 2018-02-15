import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { Landing } from './landing';
import { SharedModule } from '../../app/shared.module';

@NgModule({
	declarations: [
		Landing,
	],
	imports: [
		IonicPageModule.forChild(Landing),
		SharedModule,
	],
	exports: [
		Landing,
	]
})
export class LandingModule {}
