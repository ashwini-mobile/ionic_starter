import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { DetailProfilePage } from './detail-profile';
import { SharedModule } from '../../app/shared.module';

@NgModule({
  declarations: [
    DetailProfilePage,
  ],
  imports: [
    IonicPageModule.forChild(DetailProfilePage),
    SharedModule
  ],
  exports: [
    DetailProfilePage
  ]
})
export class ProfileDetailPageModule {}
