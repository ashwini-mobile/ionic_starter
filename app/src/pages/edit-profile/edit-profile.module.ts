import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditProfilePage } from './edit-profile';
import { SharedModule } from '../../app/shared.module';
@NgModule({
  declarations: [
    EditProfilePage,
  ],
  imports: [
    IonicPageModule.forChild(EditProfilePage),
    SharedModule
  ],
  exports: [
    EditProfilePage
  ]
})
export class EditProfilePageModule {}
