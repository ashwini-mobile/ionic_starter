import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SosAlert } from './sos-alert';
import { SharedModule } from '../../app/shared.module';

@NgModule({
  declarations: [
    SosAlert,
  ],
  imports: [
    IonicPageModule.forChild(SosAlert),
    SharedModule
  ],
  exports: [
    SosAlert
  ]
})
export class SosAlertModule {}
