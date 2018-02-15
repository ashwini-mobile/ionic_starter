import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { Login } from './login';
import { SharedModule } from '../../app/shared.module';

@NgModule({
	declarations: [
        Login,
	],
	imports: [
		IonicPageModule.forChild(Login),
		SharedModule,
	],
	exports: [
        Login,
	]
})
export class LoginModule {}
