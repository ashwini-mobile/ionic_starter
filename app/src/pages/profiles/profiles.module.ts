import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { Profiles } from './profiles';
import { SharedModule } from '../../app/shared.module';
import { DragulaModule } from 'ng2-dragula';
import { SwingModule } from 'angular2-swing';

@NgModule({
	declarations: [
		Profiles,
	],
	imports: [
		IonicPageModule.forChild(Profiles),
		SharedModule,
		DragulaModule,
		SwingModule
	],
	exports: [
		Profiles,
	]
})
export class ProfilesModule {}
