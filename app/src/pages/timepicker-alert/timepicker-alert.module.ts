import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TimePickerAlert } from './timepicker-alert';
import { SharedModule } from '../../app/shared.module';

@NgModule({
  declarations: [
    TimePickerAlert,
  ],
  imports: [
    IonicPageModule.forChild(TimePickerAlert),
    SharedModule
  ],
  exports: [
    TimePickerAlert
  ]
})
export class TimePickerAlertModule {}
