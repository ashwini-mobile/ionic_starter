import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OfficesPage } from './offices';
import { SharedModule } from '../../app/shared.module';

@NgModule({
	declarations: [
		OfficesPage,
	],
	imports: [
		IonicPageModule.forChild(OfficesPage),
		SharedModule
	],
	exports: [
		OfficesPage,
	]
})
export class OfficesModule {}
