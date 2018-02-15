import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StepCompletePage } from './step-complete';

@NgModule({
  declarations: [
    StepCompletePage,
  ],
  imports: [
    IonicPageModule.forChild(StepCompletePage),
  ],
  exports: [
    StepCompletePage
  ]
})
export class StepCompletePageModule {}
