import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditProfileEmployeePage } from './edit-profile-employee';
import { SharedModule } from '../../app/shared.module';

@NgModule({
  declarations: [
    EditProfileEmployeePage,
  ],
  imports: [
    IonicPageModule.forChild(EditProfileEmployeePage),
    SharedModule
  ],
  exports: [
    EditProfileEmployeePage
  ]
})
export class EditProfileEmployeePageModule {}
