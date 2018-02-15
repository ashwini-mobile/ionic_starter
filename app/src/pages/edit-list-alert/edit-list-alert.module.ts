import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { EditListAlert } from './edit-list-alert';

@NgModule({
  declarations: [
    EditListAlert,
  ],
  imports: [
    IonicPageModule.forChild(EditListAlert),
  ],
  exports: [
    EditListAlert
  ]
})
export class EditListAlertModule {}
