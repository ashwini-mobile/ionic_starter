import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MessageAlert } from './message-alert';
import { DatePickerModule } from 'datepicker-ionic2';

@NgModule({
  declarations: [
    MessageAlert,
  ],
  imports: [
    IonicPageModule.forChild(MessageAlert),
    DatePickerModule
  ],
  exports: [
    MessageAlert
  ]
})
export class MessageAlertModule {}
