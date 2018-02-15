import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MessagesPage } from './messages';
import { SharedModule } from '../../app/shared.module';

@NgModule({
  declarations: [
    MessagesPage,
  ],
  imports: [
    IonicPageModule.forChild(MessagesPage),
		SharedModule,
  ],
  exports: [
    MessagesPage
  ]
})
export class MessagesPageModule {}
