import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NotificationConnectAlert } from './notification-connect-alert';

@NgModule({
  declarations: [
    NotificationConnectAlert,
  ],
  imports: [
    IonicPageModule.forChild(NotificationConnectAlert),
  ],
  exports: [
    NotificationConnectAlert
  ]
})
export class NotificationConnectAlertModule {}
