import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AskAlert } from './ask-alert';
import { SharedModule } from '../../app/shared.module';

@NgModule({
  declarations: [
    AskAlert,
  ],
  imports: [
    IonicPageModule.forChild(AskAlert),
    SharedModule
  ],
  exports: [
    AskAlert
  ]
})
export class AskAlertModule {}
