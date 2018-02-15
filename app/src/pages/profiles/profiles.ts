import { Component, ViewChild, ElementRef, OnInit, ViewChildren, QueryList } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ActionSheetController, FabContainer, Platform } from 'ionic-angular';
import { DataSvcProvider } from '../../providers/data-svc/data-svc';
import { DetailProfilePage } from '../detail-profile/detail-profile';
import { ShareAlert } from '../share-alert/share-alert';
import { Dashboard } from '../dashboard/dashboard';
import * as $ from 'jquery';
import 'rxjs/Rx';
import { SearchFilterServiceProvider } from '../../providers/search-filter-service/search-filter-service';
import {
  StackConfig,
  Stack,
  Card,
  ThrowEvent,
  DragEvent,
  SwingStackComponent,
  SwingCardComponent} from 'angular2-swing';
import { UserProvider } from '../../providers/user-provider';
import { LikeDislikeProvider } from '../../providers/like-dislike-provider';
import { FriendshipProvider } from '../../providers/friendship-provider';
import { EmployeeBenchProvider } from '../../providers/employee-bench-provider';
import { EmployerBenchProvider } from '../../providers/employer-bench-provider';
import { EmployerProfileProvider } from '../../providers/employer-profile-provider';
import { EmployeeProfileProvider } from '../../providers/employee-profile-provider';

@IonicPage()
@Component({
	selector: 'page-profiles',
	templateUrl: 'profiles.html',
	host: {
			'(document:click)': 'onClick($event)',
	}
})
export class Profiles implements OnInit{
	rootNavCtrl: NavController;
	tabSlected: string = 'friends';
	@ViewChild('fab') fab: FabContainer;
	@ViewChild('myswing') swingStack: SwingStackComponent;
	@ViewChild('myswing2') swingStack2: SwingStackComponent;
	@ViewChildren('mycards1') swingCards: QueryList<SwingCardComponent>;
	@ViewChild('contentCard') contentCardEl: ElementRef;
	private stackConfig: StackConfig;
	private recentCard: string = '';
	private arrayFriends: any = [];
	private arrayOpportunities: any = [];
	private arrayHouse: any;
	private checkSwipeLeft: boolean;
	private indexCardSelected: number;
	private isCheckEndDrag: boolean = false;
	private currentUserId: number;
    private currentUserType: string;
	private currentEmployeeOnDisplay: number = 0;
    private currentEmployerOnDisplay: number = 0;
	private isShowFilterContent: boolean = false;

    private genericBenchProvider: any;
	private watchLaterBench: any;
	private deviceWidth: number;
	private deviceHeight: number;

	constructor(
		public nav: NavController,
		public navParams: NavParams,
		private userProvider: UserProvider,
		private employerProfileProvider: EmployerProfileProvider,
		private employeeProfileProvider: EmployeeProfileProvider,
		private likeDislikeProvider: LikeDislikeProvider,
		private friendshipProvider: FriendshipProvider,
        private employerBenchProvider: EmployerBenchProvider,
        private employeeBenchProvider: EmployeeBenchProvider,
		private dataSvc: DataSvcProvider,
		private modal: ModalController,
		private dashboardCtr: Dashboard,
		public actionSheetCtrl: ActionSheetController,
        private filterService: SearchFilterServiceProvider,
		private platform: Platform
	) {
        this.rootNavCtrl = navParams.get('rootNavCtrl');
        this.stackConfig = {
            throwOutConfidence: (offsetX, offsetY, element) => {
				return Math.min(Math.max(Math.abs(offsetX) / (element.offsetWidth / 2), Math.abs(offsetY) / (element.offsetHeight / 2)), 1);
                // return Math.min(Math.abs(offsetX) / (element.offsetWidth / 2), 1);
            },
            transform: (element, x, y, r) => {
                this.onItemMove(element, x, y, r);
            },
            throwOutDistance: (d) => {
                return 800;
            }
		};

        this.userProvider.getCurrentUser().subscribe(response => {
                this.currentUserId = response.id;
                this.currentUserType = response.types[0];

                if (this.currentUserType === 'employer') {
                    this.genericBenchProvider = this.employerBenchProvider;
                } else {
                    this.genericBenchProvider = this.employeeBenchProvider;
                }

                this.genericBenchProvider.search(this.currentUserId, 'Watch Later', true).subscribe(response => {
                    if (response.items) {
                        this.watchLaterBench = response.items.find(i => i.name === 'Watch Later');
                    }

                    if (this.watchLaterBench === null || this.watchLaterBench === undefined) {
                        let input: any = { 'name': 'Watch Later' };
                        if (this.currentUserType === 'employer') {
                            input.employees = [];
                        } else {
                            input.employers = [];
                        }

                        this.genericBenchProvider.create(input, true).subscribe(response => {
                            this.watchLaterBench = response;
                            //console.log(this.watchLaterBench);
                        }, error => {
                            console.log('Error creating bench');
                            console.log(JSON.stringify(error));
                        });
                    }
                }, error => {
                    console.log('Error in retrieving bench');
                    console.log(JSON.stringify(error));
                });

        		this.likeDislikeProvider.get(this.currentUserId, null).subscribe(response => {
						let excludedUsers: any = response.items.map(u => u.targetUserId);
						excludedUsers.push(this.currentUserId);

                        this.userProvider.getUsersWithBasicInfo('employee').subscribe(response => {
                                response.items.filter(e => !excludedUsers.includes(e.user.id) && e.employee).forEach(e => {
                                    let friend: any = {
                                        ...e,
                                        name: e.employee.occupation !== null ? e.employee.occupation.value : '',
                                        status: e.user.local.username,
                                        avata: 'assets/img/sm-stock02.png',
                                        big_avata: 'assets/img/profile-00.png',
                                        card_avata: 'assets/img/img-card.png',
                                        city: e.employee.employeeLocation.locality,
                                        state: e.employee.employeeLocation.state || 'CA',
                                        year_exp: e.employee.yearsOfExperience,
                                        profileId: e.employee.id
                                    };
                                    this.arrayFriends.push(friend);
                                });
                            },
                            error => {
                                console.log('Error in retrieving employees');
                                console.log(JSON.stringify(error));
                            });

                        this.userProvider.getUsersWithBasicInfo('employer').subscribe(response => {
                                response.items.filter(e => !excludedUsers.includes(e.user.id) && e.employer).forEach(e => {
                                    let opportunity: any = {
                                        ...e,
                                        employees: [
                                            {
                                                image: 'assets/img/sm-thumbnail01.png',
                                            },
                                            {
                                                image: 'assets/img/sm-thumbnail01.png',
                                            },
                                            {
                                                image: 'assets/img/sm-thumbnail01.png',
                                            },
                                            {
                                                image: 'assets/img/sm-thumbnail01.png',
                                            },
                                            {
                                                image: 'assets/img/sm-thumbnail01.png',
                                            },
                                        ],
					name: e.employer.offices[0].businessName,
                                        status: e.employer.specializations.length > 0 ? this.getFormattedSpecialization(e.employer.specializations) : '',
                                        rate: 4,
                                        image: 'assets/img/house01.jpg',
                                        city: e.employer.offices[0].address.locality.locality,
                                        state: e.employer.offices[0].address.locality.state,
                                        distance: '5,9 mi',
                                        profileId: e.employer.id
                                    };
                                    this.arrayOpportunities.push(opportunity);
                                });
                            },
                            error => {
                                console.log('Error in retrieving employers');
                                console.log(JSON.stringify(error));
                            });
                    },
                    error => {
                        console.log('Error in retrieving current user info');
                        console.log(JSON.stringify(error));
                    });
            },
            error => {
                console.log('Error in retrieving current user info');
                console.log(JSON.stringify(error));
            });

    }
	ionViewWillEnter(): void {
		this.filterService.listParam = [];
		this.isShowFilterContent = false;
	}
	ionViewWillLeave(): void {
		this.filterService.listParam = [];
		this.isShowFilterContent = false;
		$('search-filter').remove();
	}
	ngAfterViewInit(): void {
		this.swingStack.dragstart.subscribe((event: DragEvent) => {
			this.isCheckEndDrag = false;
		});

		this.swingStack.dragend.subscribe((event: DragEvent) => {
			this.isCheckEndDrag = true;
		});

		this.swingStack2.dragstart.subscribe((event: DragEvent) => {
			this.isCheckEndDrag = false;
		});

		this.swingStack2.dragend.subscribe((event: DragEvent) => {
			this.isCheckEndDrag = true;
		});
	}

	getFormattedSpecialization(arr: any): string {
		let len: any = arr.length;
		let temparr: any = arr.map((d, i) => {
			if (i === len - 2) {
				return d.value + '&';
			}
			if (i === len - 1) {
				return d.value;
			}
			return d.value + ', ';
		});
		return temparr.join('');
	}
	// click select tab friends
	selectTabFuncFriends(): void {
		if (this.tabSlected === 'opportunities') {
			this.selectTabFunc('friends');
		}
	}
	// click select tab pportunities
	selectTabFuncOpportunities(): void {
		if (this.tabSlected === 'friends') {
			this.selectTabFunc('opportunities');
		}
	}
	// click select tab
	selectTabFunc(name: string): void {
		this.filterService.listParam = [];
		this.isCheckEndDrag = false;
		this.tabSlected = name;
	}
	closeMultiUse(): void {
		if ($('.social-selected').find('ion-fab-list').hasClass('fab-list-active')) {
			$('.social-selected').find('ion-fab-list').addClass('fab-list-hide');
			$('.social-selected').find('ion-fab-list').find('button').removeClass('show-btn');
			$('.social-selected').find('ion-fab-list').find('button').addClass('hide-btn');
			$('.social-selected').find('ion-fab-list').find('.btn1').addClass('transition-delay');
			$('.social-selected').find('ion-fab-list').find('.btn2').removeClass('transition-delay');
		} else {
			$('.social-selected').find('ion-fab-list').removeClass('fab-list-hide');
			$('.social-selected').find('ion-fab-list').find('button').addClass('show-btn');
			$('.social-selected').find('ion-fab-list').find('button').removeClass('hide-btn');
			$('.social-selected').find('ion-fab-list').find('.btn1').removeClass('transition-delay');
			$('.social-selected').find('ion-fab-list').find('.btn2').addClass('transition-delay');
		}
	}
	// Called whenever we drag an element
	onItemMove(element: any, x: any, y: any, r: any): void {
		element.classList.remove('class-like');
		element.classList.remove('class-unlike');
		element.classList.remove('class-heart');
		this.contentCardEl.nativeElement.classList.remove('active-left');
		this.contentCardEl.nativeElement.classList.remove('active-right');
		if (!this.isCheckEndDrag) {
			if (y < -10) {
				element.classList.add('class-heart');
				element.classList.remove('class-unlike');
				element.classList.remove('class-like');
				let opacity: number = Math.abs(y) * 4 / this.deviceHeight;
				$('.notify-icon-on-profile').css('opacity', `${opacity}`);
			} else  {
				if ( x > 0 ) {
					element.classList.add('class-like');
					element.classList.remove('class-unlike');
					element.classList.remove('class-heart');
					this.contentCardEl.nativeElement.classList.remove('active-left');
					if ( x > 50) {
						this.contentCardEl.nativeElement.classList.add('active-right');
					}
				}else if ( x < 0) {
					element.classList.add('class-unlike');
					element.classList.remove('class-like');
					element.classList.remove('class-heart');
					this.contentCardEl.nativeElement.classList.remove('active-right');
					if ( x < -50) {
						this.contentCardEl.nativeElement.classList.add('active-left');
					}
				}else {
					element.classList.remove('class-like');
					element.classList.remove('class-unlike');
					element.classList.remove('class-heart');
					this.contentCardEl.nativeElement.classList.remove('active-left');
					this.contentCardEl.nativeElement.classList.remove('active-right');
				}
				let opacity: number = Math.abs(x) * 3 / this.deviceWidth;
				$('.notify-icon-on-profile').css('opacity', `${opacity}`);
			}
		}
		element.style['transform'] = `translate3d(0, 0, 0) translate(${x}px, ${y}px) rotate(${r}deg)`;
		element.style['transition-duration'] = '0s';
	}
	toggleFilterContent(): void {
		this.isShowFilterContent = !this.isShowFilterContent;
		setTimeout( () => {
			$('.mainn-content-filter').css('top', '100%');
			$('.mainn-content-filter').animate({top: '0%'}, 300);
		}, 10);
	}
	nextCard(): void {
		if (this.tabSlected === 'friends') {
			this.currentEmployeeOnDisplay = this.indexCardSelected;
			this.arrayFriends.splice(this.arrayFriends.length - 1, 0, this.arrayFriends.splice(this.indexCardSelected, 1)[0]);
		} else if (this.tabSlected === 'opportunities') {
            this.currentEmployerOnDisplay = this.indexCardSelected;
			this.arrayOpportunities.splice(this.arrayOpportunities.length - 1, 0, this.arrayOpportunities.splice(this.indexCardSelected, 1)[0]);
		}
	}
	voteUp(vote: boolean): void {
		let profile: any = this.arrayFriends[this.indexCardSelected];
		this.likeDislike(profile, vote);
		this.nextCard();
	}

	likeDislike(profile: any, like: boolean): void {
		if (profile && profile.user && profile.user.id) {
            this.likeDislikeProvider.create({
                'requestorUserId': this.currentUserId,
                'targetUserId': profile.user.id,
                'like': like,
            }, true).subscribe(response => {
                },
                error => {
                    console.log('Error liking/disliking profile');
                    console.log(JSON.stringify(error));
                });
        }
	}

	endDragFunc(): void {
		this.contentCardEl.nativeElement.classList.remove('active-left');
	}

	swiperFunc(index: number): void {
		this.indexCardSelected = index;
	}

	swipeToleft(): void {
		let that: this = this;
		$('.card.card-1').addClass('class-unlike');
		$('.card.card-1').removeClass('class-like');
		$('.card.card-1').removeClass('class-heart');
		$('.card.card-1').css('transform', `translate3d(0, 0, 0) translate(${-350}px, ${250}px) rotate(${-20}deg)`);
		$('.card.card-1').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend',
		function(e: any): void {
			that.indexCardSelected = 0;
			that.voteUp(false);
			that.endDragFunc();
	  	});
	}

	swipeToRight(): void {
		let that: this = this;
		$('.card.card-1').addClass('class-like');
		$('.card.card-1').removeClass('class-unlike');
		$('.card.card-1').removeClass('class-heart');
		$('.card.card-1').css('transform', `translate3d(0, 0, 0) translate(${350}px, ${250}px) rotate(${20}deg)`);
		$('.card.card-1').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend',
		function(e: any): void {
			that.indexCardSelected = 0;
			that.voteUp(true);
			that.endDragFunc();
	  	});
	}

	swipeUp(animate: boolean): void {
		if (!animate) {
			this.indexCardSelected = 0;
			this.nextCard();
			this.endDragFunc();
			return;
		}
		let that: this = this;
		$('.card.card-1').addClass('class-heart');
		$('.card.card-1').removeClass('class-like');
		$('.card.card-1').removeClass('class-unlike');
		$('.card.card-1').css('transform', `translate3d(0, 0, 0) translate(${0}px, ${-110}%) rotate(${2}deg)`);
		$('.card.card-1').css('transition-duration', '0.4s');
		$('.card.card-1').one('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend',
		function(e: any): void {
			that.indexCardSelected = 0;
			that.nextCard();
			that.endDragFunc();
	  	});
	}

	ngOnInit(): void {
		//this.loadDataFriends();
		// this.loadDataOpportunities();
	}
	ionViewDidEnter(): void {
		$('.touch-button').remove();
		this.isShowFilterContent = false;
		(<any>this.dashboardCtr).viewFilterParamDidExit = this.viewFilterParamDidExit;
		(<any>this.dashboardCtr).profilesV = this;
		this.viewFilterParamDidExit(this);
	}
	viewFilterParamDidExit(that: any): void {
		setTimeout(function(): void {
			that.setUpMouseEvent();
		}, 150);
	}
	setUpMouseEvent(): void {
		let that: any = this;
		let onMove: (event: any) => void = function(event: any): void {
			if (event.originalEvent.touches) {
				event = event.originalEvent.touches[0];
			}
			let startX: number = event.clientX * 100.0 / that.deviceWidth;
			if (startX < 42) {
				that.selectTabFuncFriends();
			} else if (startX > 46) {
				that.selectTabFuncOpportunities();
			}
		};
		$('.segment-friend').on('mousedown touchstart', function(event: any): void {
			that.selectTabFuncFriends();
		});
		$('.segment-opp').on('mousedown touchstart', function(event: any): void {
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
		this.setUpMouseEvent();
		this.platform.ready().then((readySource) => {
			this.deviceWidth = that.platform.width();
			this.deviceHeight = that.platform.height();
		});
	}
	// get data friends
	loadDataFriends(): void {
		//list friend
		this.dataSvc.loadFriendsList().then(data => {
			// this.arrayFriends = data;
			data.forEach(d => {
				this.arrayFriends.push(d);
			});
		});
	}
	// get data oppotunities
	loadDataOpportunities(): void {
		this.dataSvc.loadOpportunities().then(data => {
			// this.arrayOpportunities = res;
            data.forEach(d => {
                this.arrayOpportunities.push(d);
            });
		});
	}
	//go setting
	goSettingPage(): void {
		this.nav.push('Setting', { title: 'Setting' });
	}
	//go detail Profile
	goDetailProfile(item: any): void {
		if (!item.user.id) {
			return;
		}

		if (this.tabSlected === 'opportunities') {
			let modalDetailProfile: any = this.modal.create('DetailProfilePage', { employer: item.user }, {
				showBackdrop: false,
				cssClass: 'modal-page-detail-profile',
				enterAnimation: 'modal-detail-card-transition-enter',
				leaveAnimation: 'modal-detail-card-transition-leave'
			});
			modalDetailProfile.present();
		}else{
			let modalDetailProfile: any = this.modal.create('DetailProfileEmployeePage', { employee: item.user }, {
				showBackdrop: false,
				cssClass: 'modal-page-detail-profile',
				enterAnimation: 'modal-detail-card-transition-enter',
				leaveAnimation: 'modal-detail-card-transition-leave'
			});
			modalDetailProfile.present();
		}
	}
	showModalShareFunc(): void {
		let actionSheet: any = this.actionSheetCtrl.create({
			title: 'Tap to Share',
			buttons: [
				{
					text: 'Email',
					role: 'destructive',
					handler: () => {
						console.log('Destructive clicked');
					}
				},
				{
					text: 'Text',
					handler: () => {
						console.log('Archive clicked');
					}
				},
				{
					text: 'Cancel',
					role: 'cancel',
					handler: () => {
						console.log('Cancel clicked');
					}
				}
			]
		});
		actionSheet.present();
	}

	// click body
	onClick(event: any): void {
		this.fab.close();
	}
	showModalShareEndorsementFunc(): void {
		this.fab.close();
		let modalAsk: any = this.modal.create('AskAlert', {}, {showBackdrop: false, cssClass: 'modal-page-ask'});
		// alertModal callback
		modalAsk.onDidDismiss((data: any) => {
		});
		modalAsk.present();
		// let modalEndorsementsPage: any = this.modal.create('EndorsementsPage', {}, { showBackdrop: true, cssClass: 'modal-endorsements-profile' });
		// modalEndorsementsPage.present();
	}

	sendFriendRequest(animate: boolean): void {
		let profile: any;
        if (this.tabSlected === 'friends') {
            profile = this.arrayFriends[this.currentEmployeeOnDisplay];
        } else if (this.tabSlected === 'opportunities') {
            profile = this.arrayOpportunities[this.currentEmployerOnDisplay];
        }
		this.swipeUp(animate);
        if (profile.user.id) {
            this.friendshipProvider.create({
                'requestorUserId': this.currentUserId,
                'targetUserId': profile.user.id,
            }, true).subscribe(response => {},
                error => {
                    console.log('Error sending friend request');
                    console.log(JSON.stringify(error));
                });
        }
	}

	watchLater(): void {
	    if ((this.tabSlected === 'friends' && this.currentUserType === 'employee') ||
            (this.tabSlected === 'opportunities' && this.currentUserType === 'employer')) {
		let targetUserId: number;
		if (this.tabSlected === 'friends') {
		    targetUserId = this.arrayFriends[this.currentEmployeeOnDisplay].user.id;
		} else if (this.tabSlected === 'opportunities') {
		    targetUserId = this.arrayOpportunities[this.currentEmployeeOnDisplay].user.id;
		}
	        const title: string = 'Request an Interview';
		const placeholderValue: string = 'Please provide a brief summary of your interview request';
		let modalDatePicker: any = this.modal.create('AppointmentAlert', { requestorUserId: this.currentUserId, targetUserId: targetUserId, title: title, placeholderVal: placeholderValue}, {enableBackdropDismiss: false, cssClass: 'datepicker-modal'});
		modalDatePicker.present();
        }
	/*
        let profile: any;
        if (this.tabSlected === 'friends') {
            profile = this.arrayFriends[this.currentEmployeeOnDisplay];
        } else if (this.tabSlected === 'opportunities') {
            profile = this.arrayOpportunities[this.currentEmployerOnDisplay];
        }

        console.log(profile);
        if (profile.profileId) {
            if (this.currentUserType === 'employee') {
                this.employeeBenchProvider.addEmployerToBench(this.watchLaterBench.id, profile.profileId).subscribe(response => {},
                    error => {
                        console.log('Error adding employer to bench');
                        // console.log(JSON.stringify(error));
                    });
            } else {
                this.employerBenchProvider.addEmployeeToBench(this.watchLaterBench.id, profile.profileId).subscribe(response => {},
                    error => {
                        console.log('Error adding employee to bench');
                        // console.log(JSON.stringify(error));
                    });
            }
        } */
    }
}
