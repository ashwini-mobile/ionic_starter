import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { AddAlertPage } from './add-alert';

@NgModule({
  declarations: [
      AddAlertPage,
  ],
  imports: [
    IonicPageModule.forChild(AddAlertPage),
  ],
  exports: [
      AddAlertPage
  ]
})
export class AddAlertPageModule {}
