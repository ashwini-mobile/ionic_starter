import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { BenchesYouLikePage } from './benches-you-like';
import { SharedModule } from '../../app/shared.module';

@NgModule({
	declarations: [
		BenchesYouLikePage,
	],
	imports: [
		IonicPageModule.forChild(BenchesYouLikePage),
		SharedModule
	],
	exports: [
		BenchesYouLikePage,
	]
})
export class BenchesYouLikePageModule {}
