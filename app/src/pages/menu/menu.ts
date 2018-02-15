import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Platform } from 'ionic-angular';
import { Dashboard } from '../dashboard/dashboard';
import * as $ from 'jquery';
@IonicPage()
@Component({
	selector: 'page-menu',
	templateUrl: 'menu.html'
})
export class Menu {
	rootNavCtrl: NavController;
	private roleUser: string = 'employee';
	private width: number = 0;
	private height: number = 0;
	private minSwipeX: number = 0; //24;
	private maxSwipeX: number = 31; //55;
	private deltaSwipeX: number = 0; //recalculate later
	private selectedCard: any;
	private currentCard: any;
	private subCard: any;
	private cardSelectIsLeft: boolean = true;
	private subbCardTranform: any = {
		deltaWidth: 0, // recalculate later
		deltaHeight: 0, // recalculate later
		deltaTop: 0, // recalculate later
		deltaLeft: 0, // recalculate later
		left: {
			width: 218,
			height: 218,
			padding: 8,
			top: -110,
			left: -110,
			z_index: 100
		},
		right: {
			width: 145,
			height: 145,
			padding: 5,
			top: -70,
			left: 20,
			z_index: 0
		}
	};
	constructor(
		public nav: NavController,
		public navParams: NavParams,
		public modalCtrl: ModalController,
		private platform: Platform,
		private dashboardCtr: Dashboard,
    ) {
		this.subbCardTranform.deltaWidth = this.subbCardTranform.right.width - this.subbCardTranform.left.width;
		this.subbCardTranform.deltaHeight = this.subbCardTranform.right.height - this.subbCardTranform.left.height;
		this.subbCardTranform.deltaTop = this.subbCardTranform.right.top - this.subbCardTranform.left.top;
		this.subbCardTranform.deltaLeft = this.subbCardTranform.right.left - this.subbCardTranform.left.left;
		this.deltaSwipeX = this.maxSwipeX - this.minSwipeX;

		let that: any = this;
		this.platform.ready().then((readySource) => {
			that.width = that.platform.width();
			that.height = that.platform.height();
		});
		this.rootNavCtrl = navParams.get('rootNavCtrl');
	}
	ionViewDidLoad(): void {
		this.changeToEmployeeWithoutAnim();
	}
	ionViewDidEnter(): void {
		$('.touch-button').remove();
		this.setUpSwipeAction();
	}

	setUpSwipeAction(): void {
		let that: any = this;
		let firstXPos: number = 0;
		let totalTranslate: number = 0;
		let onStart: (event: any) => void = function(event: any): void {
			if (event.originalEvent.touches) {
				event = event.originalEvent.touches[0];
			}
			totalTranslate = 0;
			firstXPos = event.clientX;
			that.cardSelectIsLeft = (that.currentCard.css('z-index') === '100');
			if (!that.cardSelectIsLeft) {
				let tmp: any = that.currentCard;
				that.currentCard = that.subCard;
				that.subCard = tmp;
			}
		};
		let onMove: (event: any) => void = function(event: any): void {
			if (event.originalEvent.touches) {
				event = event.originalEvent.touches[0];
			}
			let xPos: number = event.clientX - firstXPos;
			let xPercent: number = xPos * 100 / that.width;
			totalTranslate += Math.abs(xPercent);
			let leftParam: any = that.subbCardTranform.left;
			let rightParam: any = that.subbCardTranform.right;
			let sign: number = 1;
			if (that.cardSelectIsLeft) {
				if (xPercent < that.minSwipeX) { xPercent = that.minSwipeX; }
				else if (xPercent > that.maxSwipeX) { xPercent = that.maxSwipeX; }
				xPercent -= that.minSwipeX;
			} else {
				if (xPercent < -that.maxSwipeX) { xPercent = -that.maxSwipeX; }
				else if (xPercent > that.minSwipeX) { xPercent = that.minSwipeX; }
				xPercent = -xPercent;
			}


			let deltaWidth: number = that.subbCardTranform.deltaWidth;
			let deltaHeight: number = that.subbCardTranform.deltaHeight;
			let deltaTop: number = that.subbCardTranform.deltaTop;
			let deltaLeft: number = that.subbCardTranform.deltaLeft;
			let width: number = ( sign * xPercent * deltaWidth * 1.0 / that.deltaSwipeX ) + leftParam.width;
			let height: number  = ( sign * xPercent * deltaHeight * 1.0 / that.deltaSwipeX ) + leftParam.height;
			let top: number  = ( sign * xPercent * deltaTop * 1.0 / that.deltaSwipeX ) + leftParam.top;
			let left: number  = ( sign * xPercent * deltaLeft * 1.0 / that.deltaSwipeX ) + leftParam.left;
			that.currentCard.css('width', `${width}px`);
			that.currentCard.css('height', `${height}px`);
			that.currentCard.css('top', `${top}px`);
			that.currentCard.css('left', `${left}px`);
			// reverse
			width = ( - sign * xPercent * deltaWidth * 1.0 / that.deltaSwipeX ) + rightParam.width;
			height = ( - sign * xPercent * deltaHeight * 1.0 / that.deltaSwipeX ) + rightParam.height;
			top = ( - sign * xPercent * deltaTop * 1.0 / that.deltaSwipeX ) + rightParam.top;
			left = ( - sign * xPercent * deltaLeft * 1.0 / that.deltaSwipeX ) + rightParam.left;
			that.subCard.css('width', `${width}px`);
			that.subCard.css('height', `${height}px`);
			that.subCard.css('top', `${top}px`);
			that.subCard.css('left', `${left}px`);

			if (xPercent > that.deltaSwipeX / 2) {
				that.currentCard.css('z-index', `${rightParam.z_index}`);
				that.subCard.css('z-index', `${leftParam.z_index}`);
			} else {
				that.currentCard.css('z-index', `${leftParam.z_index}`);
				that.subCard.css('z-index', `${rightParam.z_index}`);
			}
		};
		let onEnd: (event: any) => void = function(event: any): void {
			if (totalTranslate < 2) {
			} else {
				let isActiveUser: boolean = true;
				isActiveUser = ($('.subb-card').css('z-index') === '100');
				if (isActiveUser) {
					that.changeToEmployee();
				} else {
					that.changeToEmployer();
				}
			}

		};
		$('.subb-card').on('mousedown touchstart', function(event: any): void {
			that.selectedCard = $('.subb-card');
			that.currentCard = $('.subb-card');
			that.subCard = $('.mainn-card');
			onStart(event);
		});
		$('.subb-card').on('mousemove touchmove', function(event: any): void { onMove(event); });
		$('.subb-card').on('mouseup touchend', function(event: any): void { onEnd(event); });
		$('.subb-card').on('mouseup touchcancel', function(event: any): void { onEnd(event); });
		$('.mainn-card').on('mousedown touchstart', function(event: any): void {
			that.selectedCard = $('.mainn-card');
			that.currentCard = $('.mainn-card');
			that.subCard = $('.subb-card');
			onStart(event);
		});
		$('.mainn-card').on('mousemove touchmove', function(event: any): void { onMove(event); });
		$('.mainn-card').on('mouseup touchend', function(event: any): void { onEnd(event); });
		$('.mainn-card').on('mouseup touchcancel', function(event: any): void { onEnd(event); });
		this.currentCard = $('.subb-card');
		this.subCard = $('.mainn-card');
	}

	showOfficesFunc(): void {
		let alertModal: any = this.modalCtrl.create('OfficesAlertPage', {enableBackdropDismiss: false});
		// alertModal callback
		alertModal.onDidDismiss((data: any) => {
		});
		alertModal.present();
	}

	showOfficesMoDal(): void {
		this.dashboardCtr.officesModal = this.modalCtrl.create('OfficesPage', {}, {
			showBackdrop: true,
			cssClass: 'modal-page-offices',
			enterAnimation: 'modal-transition-enter',
			leaveAnimation: 'modal-transition-leave'
		});
		// alertModal callback
		this.dashboardCtr.officesModal.onDidDismiss((data: any) => {
			this.dashboardCtr.isShowDetailOffices = false;
		});
		this.dashboardCtr.officesModal.present();
		this.dashboardCtr.isShowDetailOffices = true;
	}

	// show activity Page
	showActivityFunc(): void {
		this.dashboardCtr.activityModal = this.modalCtrl.create('ActivityPage', {}, {
			showBackdrop: false,
			cssClass: 'modal-page-activity',
			enterAnimation: 'modal-transition-enter',
			leaveAnimation: 'modal-transition-leave'
		});
		// alertModal callback
		this.dashboardCtr.activityModal.onDidDismiss((data: any) => {
			this.dashboardCtr.isShowDetailActivity = false;
		});
		this.dashboardCtr.activityModal.present();
		this.dashboardCtr.isShowDetailActivity = true;
	}
	// show edit Profile
	showEditPageFunc(): void {
		let modalEditProfile: any = this.modalCtrl.create('EditProfilePage', {}, {
			showBackdrop: false,
			cssClass: 'modal-page-detail-profile',
			enterAnimation: 'modal-transition-enter',
			leaveAnimation: 'modal-transition-leave'
		});
		// alertModal callback
		modalEditProfile.onDidDismiss((data: any) => {
		});
		modalEditProfile.present();
	}

	// show edit Profile Employee
	showEditPageEmployeeFunc(): void {
		let modalEditProfile: any = this.modalCtrl.create('EditProfileEmployeePage', {}, {
			showBackdrop: false,
			cssClass: 'modal-page-detail-profile',
			enterAnimation: 'modal-transition-enter',
			leaveAnimation: 'modal-transition-leave'
		});
		// alertModal callback
		modalEditProfile.onDidDismiss((data: any) => {
		});
		modalEditProfile.present();
	}

    // Show Settings Page
    showSettings(): void {
        this.dashboardCtr.settingsModal = this.modalCtrl.create('SettingsPage', {}, {
            showBackdrop: false,
            cssClass: 'modal-page-settings',
        });
        // alertModal callback
        this.dashboardCtr.settingsModal.onDidDismiss((data: any) => {
			this.dashboardCtr.isShowSettings = false;
			if (data.needLogout === true) {
				this.dashboardCtr.nav.setRoot('Welcome');
			}
        });
        this.dashboardCtr.settingsModal.present();
        this.dashboardCtr.isShowSettings = true;
    }

	changeToEmployee(): void {
		if (this.roleUser === 'employee') { return; }
		this.roleUser = 'employee';
		this.setUpCssForEmployee();
	}

	changeToEmployeeWithoutAnim(): void {
		this.roleUser = 'employee';
		this.setUpCssForEmployeeWithoutAnim();
	}

	changeToEmployer(): void {
		if (this.roleUser === 'employer') { return; }
		this.roleUser = 'employer';
		this.setUpCssForEmployer();
	}

	setDivToParamWithoutAnim(div: any, param: any): void {
		div.css('width', `${param.width}px`);
		div.css('height', `${param.height}px`);
		div.css('top', `${param.top}px`);
		div.css('left', `${param.left}px`);
		div.css('overflow', '');
		div.css('z-index', `${param.z_index}`);
	}

	setDivToParam(div: any, param: any): void {
		div.animate({
			width: `${param.width}px`,
			height: `${param.height}px`,
			top: `${param.top}px`,
			left: `${param.left}px`,
		  }, 200, 'linear', function(): void {
			div.css('width', `${param.width}px`);
			div.css('height', `${param.height}px`);
			div.css('top', `${param.top}px`);
			div.css('left', `${param.left}px`);
			div.css('overflow', '');
		  });
		div.css('overflow', '');
		div.css('z-index', `${param.z_index}`);
	}

	setUpCssForEmployeeWithoutAnim(): void {
		this.setDivToParamWithoutAnim($('.mainn-card'), this.subbCardTranform.right);
		this.setDivToParamWithoutAnim($('.subb-card'), this.subbCardTranform.left);
		$('.parent-card').addClass('tab-employee');
	}

	setUpCssForEmployee(): void {
		$('.parent-card').addClass('tab-employee');
		this.setDivToParam($('.mainn-card'), this.subbCardTranform.right);
		this.setDivToParam($('.subb-card'), this.subbCardTranform.left);
	}

	setUpCssForEmployer(): void {
		$('.parent-card').removeClass('tab-employee');
		this.setDivToParam($('.subb-card'), this.subbCardTranform.right);
		this.setDivToParam($('.mainn-card'), this.subbCardTranform.left);
	}

}
