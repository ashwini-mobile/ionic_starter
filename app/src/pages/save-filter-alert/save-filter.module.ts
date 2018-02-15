import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { SaveFilterPage } from './save-filter';
import { SharedModule } from '../../app/shared.module';

@NgModule({
  declarations: [
    SaveFilterPage,
  ],
  imports: [
    IonicPageModule.forChild(SaveFilterPage),
    SharedModule
  ],
  exports: [
    SaveFilterPage
  ]
})
export class SaveFilterPageModule {
}