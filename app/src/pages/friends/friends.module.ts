import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { Friends } from './friends';
import { SharedModule } from '../../app/shared.module';

@NgModule({
	declarations: [
		Friends,
	],
	imports: [
		IonicPageModule.forChild(Friends),
		SharedModule,
	],
	exports: [
		Friends,
	]
})
export class FriendsModule {}
