import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ShareAlert } from './share-alert';

@NgModule({
  declarations: [
    ShareAlert,
  ],
  imports: [
    IonicPageModule.forChild(ShareAlert),
  ],
  exports: [
    ShareAlert
  ]
})
export class ShareAlertModule {}
