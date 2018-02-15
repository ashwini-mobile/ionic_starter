import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { SelectSubscriptionAlert } from './select-subscription-alert';
import { SharedModule } from '../../app/shared.module';

@NgModule({
	declarations: [
		SelectSubscriptionAlert,
	],
	imports: [
		IonicPageModule.forChild(SelectSubscriptionAlert),
		SharedModule,
	],
	exports: [
		SelectSubscriptionAlert,
	]
})
export class SelectSubscriptionAlertModule {}
