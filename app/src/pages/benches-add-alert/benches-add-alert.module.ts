import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BenchesAddAlertPage } from './benches-add-alert';

@NgModule({
  declarations: [
    BenchesAddAlertPage,
  ],
  imports: [
    IonicPageModule.forChild(BenchesAddAlertPage),
  ],
  exports: [
    BenchesAddAlertPage
  ]
})
export class BenchesAddAlertPageModule {}
