import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { HelpAlert } from './help-alert';

@NgModule({
  declarations: [
	  HelpAlert,
  ],
  imports: [
    IonicPageModule.forChild(HelpAlert)
  ],
  exports: [
	  HelpAlert
  ]
})
export class HelpAlertModule {}
