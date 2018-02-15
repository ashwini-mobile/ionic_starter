import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { Benches } from './benches';
import { SharedModule } from '../../app/shared.module';
import { DragulaModule } from 'ng2-dragula';

@NgModule({
	declarations: [
		Benches,
	],
	imports: [
		IonicPageModule.forChild(Benches),
		SharedModule,
		DragulaModule
	],
	exports: [
		Benches,
	]
})
export class BenchesModule {}
