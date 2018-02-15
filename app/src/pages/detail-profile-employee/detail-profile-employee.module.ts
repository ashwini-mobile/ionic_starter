import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DetailProfileEmployeePage } from './detail-profile-employee';
import { SharedModule } from '../../app/shared.module';

@NgModule({
  declarations: [
    DetailProfileEmployeePage,
  ],
  imports: [
    IonicPageModule.forChild(DetailProfileEmployeePage),
    SharedModule
  ],
  exports: [
    DetailProfileEmployeePage
  ]
})
export class DetailProfileEmployeePageModule {}
