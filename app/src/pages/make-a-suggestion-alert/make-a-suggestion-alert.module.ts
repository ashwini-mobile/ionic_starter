import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { MakeASuggestionAlert } from './make-a-suggestion-alert';

@NgModule({
  declarations: [
	  MakeASuggestionAlert,
  ],
  imports: [
    IonicPageModule.forChild(MakeASuggestionAlert)
  ],
  exports: [
	  MakeASuggestionAlert
  ]
})
export class MakeASuggestionAlertModule {}
