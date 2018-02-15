import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EmployerProfilePage } from './employer-profile';

@NgModule({
  declarations: [
    EmployerProfilePage,
  ],
  imports: [
    IonicPageModule.forChild(EmployerProfilePage),
  ],
  exports: [
    EmployerProfilePage
  ]
})
export class EmployerProfilePageModule {}
