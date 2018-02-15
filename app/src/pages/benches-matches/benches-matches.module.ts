import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { BenchesMatchesPage } from './benches-matches';
import { SharedModule } from '../../app/shared.module';

@NgModule({
	declarations: [
		BenchesMatchesPage,
	],
	imports: [
		IonicPageModule.forChild(BenchesMatchesPage),
		SharedModule,
	],
	exports: [
		BenchesMatchesPage,
	]
})
export class BenchesMatchesPageModule {}
