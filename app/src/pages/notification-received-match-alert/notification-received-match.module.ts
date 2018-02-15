import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { NotificationReceivedMatchPage } from './notification-received-match';

@NgModule({
  declarations: [
    NotificationReceivedMatchPage,
  ],
  imports: [
    IonicPageModule.forChild(NotificationReceivedMatchPage),
  ],
  exports: [
    NotificationReceivedMatchPage
  ]
})
export class NotificationReceivedMatchPageModule {}
