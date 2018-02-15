import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { DataSvcProvider } from '../../providers/data-svc/data-svc';

@IonicPage()
@Component({
	selector: 'page-image-picker',
	templateUrl: 'image-picker.html',
	providers: [DataSvcProvider]
})

export class ImagePicker {
	private heightWindow: number;
	private images: any;

	constructor(
		public nav: NavController,
        public navParams: NavParams,
        public viewCtrl: ViewController,
	) {
		this.images = navParams.data.images;
		this.images.forEach(i => i.isSelected = false);
	}

	ionViewDidLoad(): void {
		this.heightWindow = window.screen.height;
	}

	selectFunc(i: number): void {
        this.images[i].isSelected = !this.images[i].isSelected;
	}

	submitSelected(): void {
		this.closeModal(this.images);
	}

	closeModal(images: any): void {
		this.viewCtrl.dismiss(images);
	}

}
