import { Component, ViewChild, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, AlertController, Platform } from 'ionic-angular';
import { DataSvcProvider } from '../../providers/data-svc/data-svc';
import { FilterDetailPage } from '../filter-detail/filter-detail';
import { Dashboard } from '../dashboard/dashboard';
import { NotificationAlert } from '../notification-alert/notification-alert';
import { SaveFilterPage } from '../save-filter-alert/save-filter';
import * as $ from 'jquery';
import { UserProvider } from '../../providers/user-provider';
import { SearchFilterServiceProvider } from '../../providers/search-filter-service/search-filter-service';

@IonicPage()
@Component({
	selector: 'page-search',
	templateUrl: 'search.html'
})
export class Search implements OnInit {
    rootNavCtrl: NavController;

	private listCategorySearch: any[];
	private titleTabSearch: string = 'friends';
    private titleTabSearchUI: string = 'friends';
	private querySearchFriend: string = '';
	private heightIndex: number;
	private txtTitleTab: string = 'Opportunities';

    private currentUserId: number;
    private currentUserType: string;
    private isShowFilterContent: boolean = false;
    private isRunAnimationShuffle: boolean = false;
    private defaultFriendAvatar: string = 'assets/img/profile-01.png';
    private defaultOpportunitiesAvatar: string = 'assets/img/house01.jpg';
	private width: number = 0;

	constructor(
		public nav: NavController,
		public navParams: NavParams,
        private userProvider: UserProvider,
		public modalCtrl: ModalController,
		public alertCtrl: AlertController,
        private dashboardCtr: Dashboard,
        private filterService: SearchFilterServiceProvider,
		private platform: Platform,
        private svcService: DataSvcProvider
	) {
		this.rootNavCtrl = navParams.get('rootNavCtrl');
		this.heightIndex = window.screen.height;
    }
	viewFilterParamDidExit(that: any): void {
		setTimeout(function(): void {
			that.setUpMouseEvent();
		}, 150);
	}
	ionViewDidEnter(): void {
		$('.touch-button').remove();
		this.isShowFilterContent = false;
		this.filterService.listParam = [];
		(<any>this.dashboardCtr).viewFilterParamDidExit = this.viewFilterParamDidExit;
		(<any>this.dashboardCtr).searchV = this;
		this.viewFilterParamDidExit(this);
	}
    ionViewWillEnter(): void {
        console.log('ionViewWillEnter');
    }
	ionViewWillLeave(): void {
		this.isShowFilterContent = false;
		this.filterService.listParam = [];
		$('search-filter').remove();
	}

	setUpMouseEvent(): void {
		let that: any = this;

		let onMove: (event: any) => void = function(event: any): void {
            if (that.isRunAnimationShuffle) return;
			if (event.originalEvent.touches) {
				event = event.originalEvent.touches[0];
			}
			let startX: number = event.clientX * 100.0 / that.width;
			if (startX < 42) {
				that.selectTabFuncFriends();
			} else if (startX > 46) {
				that.selectTabFuncOpportunities();
            }
		};
		$('.segment-friend').on('mousedown touchstart', function(event: any): void {
            if (that.isRunAnimationShuffle) return;
			that.selectTabFuncFriends();
		});
		$('.segment-opp').on('mousedown touchstart', function(event: any): void {
            if (that.isRunAnimationShuffle) return;
			that.selectTabFuncOpportunities();
		});
		$('.segment-friend').on('mousemove touchmove', function(event: any): void {
			onMove(event);
		});
		$('.segment-opp').on('mousemove touchmove', function(event: any): void {
			onMove(event);
		});

	}

	ionViewDidLoad(): void {
		let that: any = this;
		this.platform.ready().then((readySource) => {
			that.width = that.platform.width();
		});
	}

	getTitleTab(): string {
		if ( this.dashboardCtr.roleUser && this.dashboardCtr.roleUser === 'employee') {
			this.txtTitleTab = 'Employee';
		}else{
			this.txtTitleTab = 'Opportunities';
		}
		return this.txtTitleTab;
	}

	ngOnInit(): void {
		this.loadAll();
    }

	loadAll(): void {
        this.userProvider.getCurrentUser().subscribe(response => {
                this.currentUserId = response.id;
                this.currentUserType = response.types[0];
                let excludedUsers: any = [];
                excludedUsers.push(this.currentUserId);

                this.userProvider.getUsersWithBasicInfo('employee').subscribe(response => {
					let listAllFriends: any = [];
					response.items.filter(e => !excludedUsers.includes(e.user.id) && e.employee).forEach(e => {
						listAllFriends.push({
							userId: e.user.id,
							name: e.user.local.username || e.user.facebook.username || e.user.linkedIn.username || e.user.google.username,
							employeeLocation: e.employee.employeeLocation,
							photos: []
						});
					});
					this.filterService.setListAllFriends(listAllFriends);
					this.searchFriend();
				},
				error => {
					console.log('Error in retrieving friends');
					console.log(JSON.stringify(error));
				});

                this.userProvider.getUsersWithBasicInfo('employer').subscribe(response => {
					let listAllOpportunities: any = [];
					response.items.filter(e => !excludedUsers.includes(e.user.id) && e.employer).forEach(e => {
						listAllOpportunities.push({
							userId: e.user.id,
							name: e.employer.businessName,
							offices: e.employer.offices,
							photos: []
						});
					});
					this.filterService.setListAllOpportunities(listAllOpportunities);
					this.searchOpp();
				},
				error => {
					console.log('Error in retrieving opportunities');
					console.log(JSON.stringify(error));
				});
            },
            error => {
                console.log('Error in retrieving current user info');
                console.log(JSON.stringify(error));
            });
    }
    //search Func
	searchFriend(): void {
	    if (this.titleTabSearch === 'friends') {
            this.setFriendList(Object.assign([], this.filterService.getListAllFriends()).filter(item => this.compareString(item.name || item.username || '', this.querySearchFriend)
                || this.compareString(item.city || item.employeeLocation.locality || '', this.querySearchFriend) || this.compareString(item.state || item.employeeLocation.state || '', this.querySearchFriend)));
        } else {
            this.setOpportunitiesList(Object.assign([], this.filterService.getListAllOpportunities()).filter(item => this.compareString(item.name || item.businessName || '', this.querySearchFriend)
                || this.compareString(item.city || item.offices[0].address.locality.locality || '', this.querySearchFriend) || this.compareString(item.state || item.offices[0].address.locality.state || '', this.querySearchFriend)));
        }
	}
	searchOpp(): void {
		this.setOpportunitiesList(Object.assign([], this.filterService.getListAllOpportunities()).filter(item => this.compareString(item.name || item.businessName || '', this.querySearchFriend)
		|| this.compareString(item.city || item.offices[0].address.locality.locality || '', this.querySearchFriend) || this.compareString(item.state || item.offices[0].address.locality.state || '', this.querySearchFriend)));
	}
	toggleFilterContent(): void {
		this.isShowFilterContent = !this.isShowFilterContent;
		setTimeout( () => {
			$('.mainn-content-filter').css('top', '100%');
			$('.mainn-content-filter').animate({top: '0%'}, 300);
		}, 10);
	}

	// change segment tab
	segmentChanged(event: any): void {
		this.querySearchFriend = '';
		if (this.titleTabSearch === 'friends') {
			this.searchFriend();
		}else {
			this.searchOpp();
		}
		console.log(event);
    }
    shuffle(a: any[]): any {
        let j: number, x: number, i: number;
        if (a.length >= 2) {
            x = a[0];
            a[0] = a[1];
            a[1] = x;
        }
        if (a.length === 2) { return a; }
        for (i = a.length - 1; i > 0; i--) {
            j = Math.floor(Math.random() * (i + 1));
            x = a[i];
            a[i] = a[j];
            a[j] = x;
        }
        return a;
    }
    setFriendList(newList: any[]): void {
        this.filterService.setListFriends(newList);
        this.filterService.listFriendsUI = [];
        let arrayLength: number = this.filterService.listFriends.length;
        for (let i: number = 0; i < arrayLength; i++) {
            this.filterService.listFriendsUI.push(this.getUIInfoOfFriend(this.filterService.listFriends[i]));
        }
    }
    setOpportunitiesList(newList: any[]): void {
        this.filterService.setListOpportunities(newList);
        this.filterService.listOpportunitiesUI = [];
        let arrayLength: number = this.filterService.listOpportunities.length;
        for (let i: number = 0; i < arrayLength; i++) {
            this.filterService.listOpportunitiesUI.push(this.getUIInfoOfOpotunity(this.filterService.listOpportunities[i]));
        }
    }
    getUIInfoOfFriend(item: any): any {
        let uiInfo: any = {};
        let defaultPhoto: string = this.defaultOpportunitiesAvatar;
        let defaultPhoto2: string = '';
        let photo: string;
        let name: string = '';
        let location: string = '';
        defaultPhoto = this.defaultFriendAvatar;
        defaultPhoto2 = item.big_avata;
        name = item.username || item.name;
        if (item.employeeLocation) {
            location = item.employeeLocation.locality + (item.employeeLocation.state ? ', ' : '') + (item.employeeLocation.state || '');
        } else {
            location = item.city + ', ' + item.state;
        }
        if (item.photos && item.photos.length > 0) { photo = item.photos[0].url;
        } else if (item.photos && item.photos.length === 0) { photo = defaultPhoto;
        } else { photo = defaultPhoto2; }
        return {photo: photo, name: name, location: location };
    }
    getUIInfoOfOpotunity(item: any): any {
        let uiInfo: any = {};
        let defaultPhoto: string = this.defaultOpportunitiesAvatar;
        let defaultPhoto2: string = '';
        let photo: string;
        let name: string = '';
        let location: string = '';
        defaultPhoto2 = item.image;
        name = item.businessName || item.name;
        if (item.offices) {
            location = item.offices[0].address.locality.locality + (item.offices[0].address.locality.state ? ', ' : '') + (item.offices[0].address.locality.state || '');
        } else {
            location = item.city + ', ' + item.state;
        }
        if (item.photos && item.photos.length > 0) { photo = item.photos[0].url;
        } else if (item.photos && item.photos.length === 0) { photo = defaultPhoto;
        } else { photo = defaultPhoto2; }
        return {photo: photo, name: name, location: location };
    }
    getUIInfoOfUser(index: number): any {
        let uiInfo: any = {};
        if ((this.titleTabSearch === 'friends' && this.filterService.listOpportunities.length <= index) || (this.titleTabSearch !== 'friends' && this.filterService.listFriends.length <= index)) {
            return null;
		}
        let item: any;
        if (this.titleTabSearch === 'friends') {
            item = this.filterService.listOpportunities[index];
            return this.getUIInfoOfOpotunity(item);
		} else {
            item = this.filterService.listFriends[index];
            return this.getUIInfoOfFriend(item);
        }
    }
    shuffleParamsAnimation(): boolean {
        // listFriends
        // var element = document.getElementsByClassName("gen01");
        // console.log(element);
        let ulGroup: any = $('.searchGen01');
        // let newShuffle: any = this.shuffle(ulGroup.children());
        let tmpChildrends: any[] = ulGroup.children();
        for (let i: number = 0; i < tmpChildrends.length; i++) {
            tmpChildrends[i].index = i;
        }
        let newShuffle: any[] = [];
        while (tmpChildrends.length) {
            let shuffle4: any[] = [];
            for (let c: number = 0; c < 16; c++ ){
                shuffle4.push(tmpChildrends.splice( 0, 1));
                if (tmpChildrends.length === 0) { break; }
            }
            shuffle4 = this.shuffle(shuffle4);
            shuffle4.forEach(function(v: any): void {newShuffle.push(v); }, newShuffle);
        }
        let i: number = 0;
        let arrayOfPos: any[] = [];
        let isChange: boolean = false;
        ulGroup.children().each(function(): void {
            if (i >= newShuffle.length) { return; }
            let moveTo: any = $(newShuffle[i]);
            let top: number = - $(this).position().top + moveTo.position().top;
            let left: number = - $(this).position().left + moveTo.position().left;
            if ($(this).css('left') !== '0px') { left += 12; }
            arrayOfPos.push({top: top, left: left, index: newShuffle[i][0].index});
            i++;
            if (top !== 0 || left !== 0) {
                isChange = true;
            }
        });
        if (!isChange) { return false; }
        i = 0;
        let that: any = this;
        ulGroup.children().each(function(): void {
            let pos: any = arrayOfPos[i];
            let userUIInfo: any = that.getUIInfoOfUser(pos.index);
            $(this).animate({left: pos.left + 'px', top: pos.top + 'px'}, 700);
            if (userUIInfo !== null) {
                $(this).find('.bottom-info').find('.name').text(userUIInfo.name || '');
                $(this).find('.bottom-info').find('.location').text(userUIInfo.location || '');
                $(this).find('.top-avatar').find('img').attr('src', userUIInfo.photo);
            }
            // $(this).find(".top-avatar").find("img").remove();
            i++;
        });
        return true;
    }
    // click select tab friends
    selectTabFuncFriends(): void {
		if (this.titleTabSearch === 'PotentialHires') {
			this.selectTabFunc('friends');
		}
    }
    // click select tab pportunities
	selectTabFuncOpportunities(): void {
		if (this.titleTabSearch === 'friends') {
			this.selectTabFunc('PotentialHires');
		}
	}
	toggleSearchTab(tabName: string): void {
        if (this.isRunAnimationShuffle) return;
		this.querySearchFriend = '';
		if (this.titleTabSearch === 'friends') {
			this.titleTabSearch = tabName;
			//this.searchFriend();
			this.searchOpp();
		}else {
			this.titleTabSearch = tabName;
			this.searchFriend();
		}
	}
    selectTabFunc(tabName: string): void {
        if (this.isRunAnimationShuffle) { return; }
        this.titleTabSearchUI = tabName;
		if (this.isShowFilterContent) {
			this.filterService.listParam = [];
			this.toggleSearchTab(tabName);
		} else {
            let that: any = this;
            this.isRunAnimationShuffle = true;
            setTimeout( () => {
                if ( this.shuffleParamsAnimation() ) {
                    let TIME_IN_MS: number = 500;
                    setTimeout( () => {
                        that.isRunAnimationShuffle = false;
                        this.toggleSearchTab(tabName);
                    }, TIME_IN_MS);
                } else {
                    this.isRunAnimationShuffle = false;
					this.toggleSearchTab(tabName);
                }
            }, 10);
		}
    }

    compareString(str1: string, str2: string): boolean {
        if (str1.toLowerCase().indexOf(str2.toLowerCase()) !== -1 || str1.toLowerCase().trim() === str2.toLowerCase().trim()){
            return true;
        }
        return false;
    }

	// seleted notification
	showNotification(index: number): void {
		// if (index === 0 ){
		// 	let modalNotication: any = this.modalCtrl.create('NotificationConnectAlert', { data: index }, {
		// 		showBackdrop: false,
		// 		cssClass: 'modal-notification',
		// 		enterAnimation: 'modal-nof-transition-enter',
		// 		leaveAnimation: 'modal-nof-transition-leave'
		// 	});
		// 	modalNotication.present();
		// }else if (index === 1) {
		// 	let modalNotication: any = this.modalCtrl.create('NotificationReceivedPage', { data: index }, {
		// 		showBackdrop: false,
		// 		cssClass: 'modal-notification',
		// 		enterAnimation: 'modal-nof-transition-enter',
		// 		leaveAnimation: 'modal-nof-transition-leave'
		// 	});
		// 	modalNotication.present();
		// }else if (index === 2) {
		// 	let modalNotication: any = this.modalCtrl.create('NotificationReceivedMatchPage', { data: index }, {
		// 		showBackdrop: false,
		// 		cssClass: 'modal-notification',
		// 		enterAnimation: 'modal-nof-transition-enter',
		// 		leaveAnimation: 'modal-nof-transition-leave'
		// 	});
		// 	modalNotication.present();
		// }
	}

    // Go detail Profile
    goDetailProfile(item: any): void {
        if (!item.id && !item.userId) {
            return;
        }

        if (this.titleTabSearch === 'friends') {
            let modalDetailProfile: any = this.modalCtrl.create('DetailProfileEmployeePage', { employee: item, userId: item.userId }, {
                showBackdrop: false,
                cssClass: 'modal-page-detail-profile',
                enterAnimation: 'modal-detail-card-transition-enter',
                leaveAnimation: 'modal-detail-card-transition-leave'
            });
            modalDetailProfile.present();
        } else {
            let modalDetailProfile: any = this.modalCtrl.create('DetailProfilePage', { employer: item, userId: item.userId }, {
                showBackdrop: false,
                cssClass: 'modal-page-detail-profile',
                enterAnimation: 'modal-detail-card-transition-enter',
                leaveAnimation: 'modal-detail-card-transition-leave'
            });
            modalDetailProfile.present();
        }
    }

}