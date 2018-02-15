import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { FilterDetailPage } from './filter-detail';
import { SharedModule } from '../../app/shared.module';

@NgModule({
  declarations: [
    FilterDetailPage,
  ],
  imports: [
    IonicPageModule.forChild(FilterDetailPage),
    SharedModule
  ],
  exports: [
    FilterDetailPage
  ]
})
export class FilterAlertModule {
}