import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { Dashboard } from './dashboard';
import { SharedModule } from '../../app/shared.module';
import { SuperTabsModule } from 'ionic2-super-tabs';

@NgModule({
	declarations: [
		Dashboard,
	],
	imports: [
		IonicPageModule.forChild(Dashboard),
		SharedModule,
		SuperTabsModule
	],
	exports: [
		Dashboard,
	]
})
export class DashboardModule {

}
