import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { OfficesAlertPage } from './offices-alert';

@NgModule({
  declarations: [
    OfficesAlertPage,
  ],
  imports: [
    IonicPageModule.forChild(OfficesAlertPage),
  ],
  exports: [
    OfficesAlertPage
  ]
})
export class ProfileAlertPageModule {}
