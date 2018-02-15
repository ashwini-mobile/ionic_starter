import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AppointmentAlert } from './appointment-alert';
import { DatePickerModule } from 'datepicker-ionic2';

@NgModule({
  declarations: [
    AppointmentAlert,
  ],
  imports: [
    IonicPageModule.forChild(AppointmentAlert),
    DatePickerModule
  ],
  exports: [
    AppointmentAlert
  ]
})
export class AppointmentAlertModule {}
