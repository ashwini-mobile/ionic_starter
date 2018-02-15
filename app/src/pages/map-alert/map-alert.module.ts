import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MapAlertPage } from './map-alert';
import { SharedModule } from '../../app/shared.module';

@NgModule({
	declarations: [
		MapAlertPage,
	],
	imports: [
		IonicPageModule.forChild(MapAlertPage),
		SharedModule
	],
	exports: [
		MapAlertPage,
	]
})
export class MapAlertPageModule {}
