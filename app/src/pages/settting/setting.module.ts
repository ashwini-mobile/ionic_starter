import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { Setting } from './setting';
import { SharedModule } from '../../app/shared.module';

@NgModule({
	declarations: [
		Setting,
	],
	imports: [
		IonicPageModule.forChild(Setting),
		SharedModule,
	],
	exports: [
		Setting,
	]
})
export class SettingModule {}
