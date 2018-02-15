import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ProfileAlertPage } from './profile-alert';

@NgModule({
  declarations: [
    ProfileAlertPage,
  ],
  imports: [
    IonicPageModule.forChild(ProfileAlertPage),
  ],
  exports: [
    ProfileAlertPage
  ]
})
export class ProfileAlertPageModule {}