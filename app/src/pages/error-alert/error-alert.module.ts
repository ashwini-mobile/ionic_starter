import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ErrorAlertPage } from './error-alert';

@NgModule({
  declarations: [
    ErrorAlertPage,
  ],
  imports: [
    IonicPageModule.forChild(ErrorAlertPage),
  ],
  exports: [
    ErrorAlertPage
  ]
})
export class ErrorAlertPageModule {}
