import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { SelectUseCase } from './select-use-case';
import { SharedModule } from '../../app/shared.module';

@NgModule({
	declarations: [
		SelectUseCase,
	],
	imports: [
		IonicPageModule.forChild(SelectUseCase),
		SharedModule,
	],
	exports: [
		SelectUseCase,
	]
})
export class SelectUseCaseModule {}
