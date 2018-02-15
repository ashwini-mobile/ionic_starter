import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ContactUsAlert } from './contact-us-alert';

@NgModule({
  declarations: [
	  ContactUsAlert,
  ],
  imports: [
    IonicPageModule.forChild(ContactUsAlert)
  ],
  exports: [
	  ContactUsAlert
  ]
})
export class ContactUsAlertModule {}
