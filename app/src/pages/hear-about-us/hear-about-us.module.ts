import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { HearAboutUs } from './hear-about-us';
import { SharedModule } from '../../app/shared.module';

@NgModule({
	declarations: [
		HearAboutUs,
	],
	imports: [
		IonicPageModule.forChild(HearAboutUs),
		SharedModule,
	],
	exports: [
		HearAboutUs,
	]
})
export class HearAboutUsModule {}
