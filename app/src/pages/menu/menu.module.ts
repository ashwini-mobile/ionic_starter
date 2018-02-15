import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { Menu } from './menu';
import { SharedModule } from '../../app/shared.module';

@NgModule({
	declarations: [
		Menu,
	],
	imports: [
		IonicPageModule.forChild(Menu),
		SharedModule,
	],
	exports: [
		Menu,
	]
})
export class MenuModule {}
