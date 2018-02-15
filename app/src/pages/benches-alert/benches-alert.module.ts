import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BenchesAlertPage } from './benches-alert';

@NgModule({
  declarations: [
    BenchesAlertPage,
  ],
  imports: [
    IonicPageModule.forChild(BenchesAlertPage),
  ],
  exports: [
    BenchesAlertPage
  ]
})
export class BenchesAlertPageModule {}
