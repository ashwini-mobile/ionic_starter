import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { SettingsPage } from './settings';
import { SharedModule } from '../../app/shared.module';

@NgModule({
	declarations: [
        SettingsPage,
	],
	imports: [
		IonicPageModule.forChild(SettingsPage),
		SharedModule,
	],
	exports: [
        SettingsPage,
	]
})
export class SettingsModule {}
