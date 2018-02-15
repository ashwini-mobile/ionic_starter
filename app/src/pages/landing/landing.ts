import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, Slides, AlertController } from 'ionic-angular';
import { DataSvcProvider } from '../../providers/data-svc/data-svc';
import { Storage } from '@ionic/storage';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import * as $ from 'jquery';

@IonicPage()
@Component({
	selector: 'page-landing',
	templateUrl: 'landing.html',
	providers: [DataSvcProvider]
})
export class Landing {
	public arraySlides: any;
	private previousSlideIndex: number = 0;
	private slideIndex: number = 0;

	@ViewChild('landingSlides') slides: Slides;

	constructor(
		public nav: NavController,
		public dataSvcProvider: DataSvcProvider,
		public alertCtrl: AlertController,
		private storage: Storage,
		private screenOrientation: ScreenOrientation
	) {
		this.loadDataSliders();
		this.slideIndex = 0;
		storage.get('pushNotificationPopupDisable')
			.then((val) => {
				if (val === null || val === false) {
					let confirm: any = this.alertCtrl.create({
						title: '\"One Dental\" Would Like To Send You Push Notifications',
						message: 'Notifications may include alerts, sounds and icon badges. These can be configured in Settings',
						buttons: [
							{
								text: 'Don\'t Allow',
								handler: () => {
									console.log('Disagree clicked');
									storage.set('pushNotificationPopupDisable', true);
								}
							},
							{
								text: 'Ok',
								handler: () => {
									console.log('Agree clicked');
									storage.set('pushNotificationPopupDisable', true);
								}
							}
						],
						enableBackdropDismiss: false
					});
					setTimeout(function(): void {
						confirm.present();
					}, 1000);
				}
			});
	}
	loadDataSliders(): void {
	    this.dataSvcProvider.load()
	    .then(data => {
	      this.arraySlides = data;
	    });
  	}
	ionViewDidLoad(): void {
		this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
	}
	//slide change
	ionSlideWillChange(event: any): void {
		if (this.slides.getActiveIndex() < this.arraySlides.length && this.slides.getActiveIndex() >= 0) {
			$('.background-mask').css('background', $('.background-page').css('background'));
			this.previousSlideIndex = this.slideIndex;
			this.slideIndex = this.slides.getActiveIndex();

			$('.background-page').css('opacity', '0');
			$('.background-page').animate({opacity: 1}, 1000);
			$('.main-svg').css('opacity', '0');
			$('.main-svg').animate({opacity: 1}, 1000);
		}
	}
	ionViewWillEnter(): void {
	}
	openWelcome(): void {
		this.nav.setRoot('Welcome');
		// this.nav.push('Welcome', { title: 'Welcome' });
	}
	goSlide(index: any): void{
		this.slides.slideTo(index);
	}
}
