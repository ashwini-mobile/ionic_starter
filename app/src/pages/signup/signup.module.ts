import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { Signup } from './signup';
import { SharedModule } from '../../app/shared.module';

@NgModule({
	declarations: [
		Signup,
	],
	imports: [
		IonicPageModule.forChild(Signup),
		SharedModule,
	],
	exports: [
		Signup,
	]
})
export class SignupModule {}
