import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { LocationAlertPage } from './location-alert';

@NgModule({
  declarations: [
    LocationAlertPage,
  ],
  imports: [
    IonicPageModule.forChild(LocationAlertPage),
  ],
  exports: [
    LocationAlertPage
  ]
})
export class LocationAlertPageModule {}
