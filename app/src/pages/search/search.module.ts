import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { Search } from './search';
import { SharedModule } from '../../app/shared.module';

@NgModule({
	declarations: [
		Search,
	],
	imports: [
		IonicPageModule.forChild(Search),
		SharedModule,
	],
	exports: [
		Search,
	]
})
export class SearchModule {}
