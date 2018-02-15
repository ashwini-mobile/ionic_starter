import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { Welcome } from './welcome';
import { SharedModule } from '../../app/shared.module';

@NgModule({
	declarations: [
		Welcome,
	],
	imports: [
		IonicPageModule.forChild(Welcome),
		SharedModule,
	],
	exports: [
		Welcome,
	]
})
export class WelcomeModule {}
