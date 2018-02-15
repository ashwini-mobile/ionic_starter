import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, Events, Platform, ModalController } from 'ionic-angular';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import * as $ from 'jquery';
import { LocationService } from '../../providers/location-service';

@IonicPage()
@Component({
	selector: 'page-welcome',
	templateUrl: 'welcome.html'
})
export class Welcome {
    private heightWindow: number;
	private $video: any;
	private videoDuratiion: number;
	private isShowLogin: boolean = false;
	private isShowSignup: boolean = false;
	private isIos: boolean = false;
	private timeInterval: any;

	constructor(
		public nav: NavController,
		private screenOrientation: ScreenOrientation,
		private events: Events,
		private platform: Platform,
		private locationService: LocationService,
		public modalCtrl: ModalController
	) {
		events.subscribe('user:login', () => {
			this.showLogin();
		});
		let that: any = this;
		this.platform.ready().then((readySource) => {
			that.isIos = that.platform.is('ios');
		});
		this.locationService.getCurrentLocation();
	}

	showLogin(): void {
		this.isShowSignup = false;
		this.isShowLogin = true;
	}
	loadVideo(): void {
        this.heightWindow = window.screen.height;
		this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT);
		let that: any = this;
		$('.background-image').find('.scroll-content').append('<video id="video-play" class="video video-play" playsinline muted></video>');
		$('#video-play').insertAfter('#background-color');
		this.$video = $('.video-play');

		this.$video.get(0).src = 'assets/video/welcome_video.mp4';
		this.$video.get(0).load();
		that.$video.get(0).pause();
		this.$video.get(0).currentTime = 0;
		if (this.$video != null && this.$video !== undefined) {
			this.$video.css('opacity', '0');
			this.$video.fadeOut(0, function(): void {
				that.$video.get(0).play();
				setTimeout(() => {
					that.$video.css('opacity', '1');
					that.$video.fadeIn(1000);
				}, 1500);
			});

			$('.welcome-page').css('display', '');
			$('.welcome-page').css('opacity', '0.03');
			$('.welcome-page').css('z-index', '-1');
			$('.background-color').css('z-index', '1');
			this.$video.on('loadedmetadata', (e) => {
				// $('.welcome-page').css('opacity', '1');
				setTimeout(() => {
					if (!that.isIos) {
						that.timeInterval = setInterval(that.myTimer, 100, that);
					} else {
						$('.welcome-page').fadeOut(0);
						$('.welcome-page').css('opacity', '1');
						$('.welcome-page').fadeIn(5000);
						// $('.welcome-page').animate({opacity: 1}, 5000);
					}
					$('.welcome-page').css('z-index', '2');
					// $('.welcome-page').css('top', '0');
					// $('.welcome-page').animate({opacity: 1}, 5000);\
					// $('.welcome-page').fadeOut(0);
					// $('.welcome-page').fadeIn(5000);
				}, 3000);
			});

		}
	}
	myTimer(welcomObj: any): void {
		let oldOpacity: number = +$('.welcome-page').css('opacity');
		oldOpacity += 0.03;
		if (oldOpacity >= 1) {
			clearInterval(welcomObj.timeInterval);
			oldOpacity = 1;
		}
		$('.welcome-page').css('opacity', `${oldOpacity}`);
	}
	ionViewWillEnter(): void {
		$('.welcome-page').css('opacity', '0');
		$('.welcome-page').fadeOut(0);
		setTimeout(() => {
			this.loadVideo();
		}, (100));
	}
}
