import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { SuperTabsController } from 'ionic2-super-tabs';
import * as $ from 'jquery';
@IonicPage()
@Component({
	selector: 'page-dashboard',
	templateUrl: 'dashboard.html'
})
export class Dashboard {
	page1: any = 'Menu';
	page2: any = 'Friends';
	page3: any = 'Profiles';
	page4: any = 'Benches';
	page5: any = 'Search';

	private showIcons: boolean = true;
	private showTitles: boolean = true;
	private pageTitle: string = 'Full Height';
	private titleTabSelected: string;
	public officesModal: any;
	public isShowDetailOffices: boolean;
	public activityModal: any;
	public isShowDetailActivity: any;

	public filterModal: any;
	public isShowDetailFilter: boolean;

	public saveFilterModal: any;
	public isShowSaveFilter: boolean;

    public settingsModal: any;
    public isShowSettings: any;

    public roleUser: string = 'employer';
	private indexSuperTab: number = 2;
	private isIos: boolean = false;

	constructor(
		public nav: NavController,
		private superTabsCtrl: SuperTabsController,
		public navParams: NavParams,
		private platform: Platform
	) {
		this.titleTabSelected = 'profiles';
		if (this.navParams.get('roleUser')) {
			this.roleUser = this.navParams.get('roleUser');
		}
		let that: any = this;
		this.platform.ready().then((readySource) => {
			that.isIos = that.platform.is('ios');
			if (that.isIos) {
				$('.ion-ios-menu').css('bottom', '1px');
			}
		});
	}

	public goSlideToPage(index: number): void {
		this.superTabsCtrl.slideTo(index);
	}

	ionViewDidLoad(): void {
		if (this.isIos) {
			$('.ion-ios-menu').css('bottom', '1px');
			$('.mask-background-color').css('margin-top', '-20px');
			$('.background-color-dashboard').css('margin-top', '-20px');
		}
		this.superTabsCtrl.enableTabsSwipe(false);

		let startX: number = 0;
		let that: any = this;
		let isTouch: boolean = false;
		let indexTrans: number = 0;
		let transformX: number = 0;
		let transform: string = '';
		let translateX: number = 0;
		let width: number = 0;
		let scaleMapFromTranslateToView: number = 4.5;
		let mouseMaxTranslateX: number = 0;
		let minX: number = 4.5;
		let transition: string = '';
		let tabbar: any = $('super-tabs-container').children();
		let selectedBtn: any = null;

		let getActiveBtn: () => void =  (): void => {
			let count: number = 0;
			$('super-tab-button').each( function(): void {
				if (count === that.indexSuperTab) {
					selectedBtn = $(this);
				}
				count += 1;
			});
		};

		let resetSelectedBtn: () => void =  (): void => {
			if (selectedBtn === null) { return; }
			selectedBtn.find('.touch-button').remove();
			selectedBtn.removeClass('selected');
			getActiveBtn();
			selectedBtn.addClass('selected');
			selectedBtn = null;
			translateX = 0;
		};

		$('super-tab-button').each( function(): void {
			$(this).on('mousedown touchstart', function(event: any): void {
				onStart(event);
			});
			$(this).on('mousemove touchmove', function(event: any): void {
				onMove(event);
			});
			$(this).on('mouseup touchend', function(event: any): void {
				onEnd(event);
			});
			$(this).on('mouseup touchcancel', function(event: any): void {
				onEnd(event);
			});
		});

		let onStart: (event: any) => void	= function(event: any): void {
			getActiveBtn();
			selectedBtn.removeClass('selected');
			selectedBtn.append(`<a class='touch-button'></a>`);
			selectedBtn.find('.touch-button').css('left', 0 + 'px');
			isTouch = true;
			if (event.originalEvent.touches) {
				event = event.originalEvent.touches[0];
			}
			startX = event.clientX;
			transform = tabbar.css('transform');
			transformX = that.getTranslateX(transform);
			transition = tabbar.css('transition');
			width = +tabbar.css('width').split('px')[0];
			mouseMaxTranslateX = width / (5 * scaleMapFromTranslateToView);
		};

		let onMove: (event: any) => void = function(event: any): void {
			if (event.originalEvent.touches) {
				event = event.originalEvent.touches[0];
			}
			translateX = startX - event.clientX;
			if ( Math.abs( translateX )  > mouseMaxTranslateX && translateX > 0) {
				translateX = mouseMaxTranslateX ;
			} else if (Math.abs( translateX )  > mouseMaxTranslateX && translateX < 0) {
				translateX = - mouseMaxTranslateX ;
			}
			let left: number = -translateX;
			if (left < -90) { left = -90; }
			else if (left > 90) { left = 90; }
			if (left < 0 && that.indexSuperTab === 0) { left = 0; }
			if (left > 0 && that.indexSuperTab === 4) { left = 0; }
			selectedBtn.find('.touch-button').css('left', left + 'px');
			// width: 1800px; transition: all 300ms cubic-bezier(0.35, 0, 0.25, 1); transform: translate3d(-720px, 0px, 0px);
			// width: 1800px; transition: initial; transform: translate3d(-782px, 0px, 0px);
			let newTransX: number = transformX + translateX * scaleMapFromTranslateToView;
			tabbar.css('transition', 'initial');
			tabbar.css('transform', 'translate3d(' + newTransX + 'px, 0px, 0px)');
		};
		let onEnd: (event: any) => void	= function(event: any): void {
			if (!isTouch) { return; }
			isTouch = false;
			if (event.changedTouches[0]) {
				event = event.changedTouches[0];
			}

            let transitionTmp: string = transition;
            let transformTmp: string = transform;
			if (translateX < -10 && that.indexSuperTab < 4) {
				setTimeout(function(): void {
					that.indexSuperTab++;
					that.superTabsCtrl.slideTo(that.indexSuperTab);
					resetSelectedBtn();
				}, 150);
			} else if (translateX > 10 && that.indexSuperTab > 0) {
				setTimeout(function(): void {
					that.indexSuperTab--;
					that.superTabsCtrl.slideTo(that.indexSuperTab);
					resetSelectedBtn();
				}, 150);
			} else {
				tabbar.css('transition', transitionTmp);
				tabbar.css('transform', transformTmp);
				resetSelectedBtn();
			}
		};

		$('super-tabs-toolbar').on('mousedown touchstart', function(event: any): void {
			onStart(event);
		});

		$('super-tabs-toolbar').on('mousemove touchmove', function(event: any): void {
			onMove(event);
		});
		$('super-tabs-toolbar').on('mouseup touchend', function(event: any): void {
			onEnd(event);
		});
		$('super-tabs-toolbar').on('mouseup touchcancel', function(event: any): void {
			onEnd(event);
		});
	}

	public getTranslateX(transform: string): number {
		let transZRegex: RegExp = /\.*matrix\((.*)\)/i;
		let zTrans: RegExpExecArray = transZRegex.exec(transform);
		let matrix: string = zTrans[1];
		let params: string[] = matrix.split(', ');
    	return +params[4];
	}

	onTabSelect(tab: { index: number; id: string; }): void {
		let previousBG: string = $('.background-color-dashboard').css('background');
		$('.mask-background-color').css('background', previousBG);
		this.indexSuperTab = tab.index;
		if (tab.index === 0) {
			this.titleTabSelected = 'menu';
		} else if (tab.index === 1) {
			this.titleTabSelected = 'friends';
		} else if (tab.index === 2) {
			this.titleTabSelected = 'profiles';
		} else if (tab.index === 3) {
			this.titleTabSelected = 'benches';
		} else if (tab.index === 4) {
			this.titleTabSelected = 'search';
		}
		$('.background-color-dashboard').css('opacity', '0');
		$('.background-color-dashboard').animate({opacity: 1}, 1000);

		if (this.officesModal) {
			this.officesModal.dismiss();
			this.isShowDetailOffices = false;
		}
		if (this.filterModal) {
			this.filterModal.dismiss();
			this.isShowDetailFilter = false;
		}
		if (this.activityModal) {
			this.activityModal.dismiss();
			this.isShowDetailActivity = false;
		}
		if (this.saveFilterModal) {
			this.saveFilterModal.dismiss();
			this.isShowSaveFilter = false;
		}
        if (this.settingsModal) {
            this.settingsModal.dismiss();
            this.isShowSettings = false;
        }
  	}
}
