import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';

import { ImagePicker } from './image-picker';
import { SharedModule } from '../../app/shared.module';

@NgModule({
	declarations: [
        ImagePicker,
	],
	imports: [
		IonicPageModule.forChild(ImagePicker),
		SharedModule,
	],
	exports: [
        ImagePicker,
	]
})
export class ImagePickerModule {}
