import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NotificationReceivedPage } from './notification-received';

@NgModule({
  declarations: [
    NotificationReceivedPage,
  ],
  imports: [
    IonicPageModule.forChild(NotificationReceivedPage),
  ],
  exports: [
    NotificationReceivedPage
  ]
})
export class NotificationReceivedPageModule {}
