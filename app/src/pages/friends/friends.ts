import { Component, ViewChild, NgZone, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ModalController } from 'ionic-angular';
import { DataSvcProvider } from '../../providers/data-svc/data-svc';
import { Dashboard } from '../dashboard/dashboard';
import * as $ from 'jquery';
import { UserProvider } from '../../providers/user-provider';
import { MatchProvider } from '../../providers/match-provider';
import { FriendshipProvider } from '../../providers/friendship-provider';
import { EmployeeProfileProvider } from '../../providers/employee-profile-provider';
import { EmployerProfileProvider } from '../../providers/employer-profile-provider';
import { MessageProvider } from '../../providers/message-provider';
import { CallNumber } from '@ionic-native/call-number';

@IonicPage()
@Component({
	selector: 'page-friends',
	templateUrl: 'friends.html',
	providers: [DataSvcProvider]
})

export class Friends implements OnInit{
	private rootNavCtrl: NavController;
	private arrayFriendsEndorsement: any;
	private arrayFriendsList: any = [];
    private arrayFriendRequests: any = [];
	private widthWindow: number;
	private loadingPopup: any;

	private currentUserId: number;
	private arrayMessageList: any = [];
	private indexCardSelected: number = 0;

	private isInit: boolean = true;

	constructor(
		public nav: NavController,
		public navParams: NavParams,
		private userProvider: UserProvider,
		private employeeProfileProvider: EmployeeProfileProvider,
        private employerProfileProvider: EmployerProfileProvider,
		private matchProvider: MatchProvider,
        private friendshipProvider: FriendshipProvider,
		private messageProvider: MessageProvider,
		private dataSvc: DataSvcProvider,
        private modalCtrl: ModalController,
		private loadingCtrl: LoadingController,
		private dashboardCtr: Dashboard,
		private callNumber: CallNumber
	) {
		this.rootNavCtrl = navParams.get('rootNavCtrl');
		// this.loadData();
	}

	ngAfterViewInit(): void {
		this.widthWindow = window.screen.width;
	}

	ionViewDidEnter(): void {
		$('.touch-button').remove();

		if (!this.isInit) {
            this.loadMatches();
            this.loadFriendships();
            this.loadFriendRequests();
            this.loadMessages();
		}
	}

	ngOnInit(): void {
		// Get the data
    	this.loadData();

        this.userProvider.getCurrentUser().subscribe(response => {
			this.currentUserId = response.id;

			this.loadMatches();
			this.loadFriendships();
            this.loadFriendRequests();
            this.loadMessages();
            this.isInit = false;
        },                                                       error => {
            console.log('Error in retrieving current user info');
            console.log(error);
        });
	}

	loadData(): void{
		//Endorsement
		this.dataSvc.loadFriendsEndorsement().then(data => {
			this.arrayFriendsEndorsement = data;
		});
	}

	loadMatches(): void {
		this.matchProvider.getByUserId(this.currentUserId).subscribe(response => {
			response.items.forEach(m => {
				let firstLike: any = m.firstLike;
				let userId: number = firstLike.targetUserId;
				if (userId === this.currentUserId) {
					userId = firstLike.requestorUserId;
				}

				this.retrieveProfile(userId);
			});
		},
			error => {
				console.log('Error in retrieving matches');
				console.log(error);
			});
	}

	loadFriendships(): void {
        this.friendshipProvider.search(this.currentUserId, null, null, null, 'confirmed').subscribe(response => {
			let friendsList: any = response.items;

            this.friendshipProvider.search(null, this.currentUserId, null, null, 'confirmed').subscribe(response => {
                    friendsList = friendsList.concat(response.items);

                    friendsList.forEach(u => {
                    	let userId: number = u.targetUserId;
                    	if (userId === this.currentUserId) {
                            userId = u.requestorUserId;
						}

                        this.retrieveProfile(userId);

                        this.arrayFriendRequests.push({
                            'avatar': 'assets/img/sm-stock02.png',
                        });
                    });

                },
                error => {
                    console.log('Error in retrieving friendships');
                    console.log(error);
                });
            },
            error => {
                console.log('Error in retrieving friendships');
                console.log(error);
            });
	}
	showMessageScreen(item: any): void {
		let that: any = this;
		this.retrieveProfileFromSV(item.userId, (friend: any): void => {
			friend.user.status = friend.status;
			that.userProvider.getCurrentUser().subscribe(
				response => {
					that.retrieveProfileFromSV(response.id, (user: any): void => {
						user.user.status = user.status;
						let modalEndorsementsPage: any = this.modalCtrl.create('MessagesPage', {friend: friend.user, user: user.user}, {
							showBackdrop: true,
							cssClass: 'modal-messages-page',
							enterAnimation: 'modal-transition-enter',
							leaveAnimation: 'modal-transition-leave'
						});
						modalEndorsementsPage.present();
					});
				},
				error => {
					console.log('Error in retrieving current user info');
					console.log(JSON.stringify(error));
				});
		});
	}
	goDetailProfileFromMessage(item: any): void {
		this.retrieveProfileFromSV(item.userId, (profile: any): void => {
			if (profile.types === 'employer') {
				let modalDetailProfile: any = this.modalCtrl.create('DetailProfilePage', { employer: profile.user }, {
					showBackdrop: false,
					cssClass: 'MessagesViewPage',
					enterAnimation: 'modal-detail-card-transition-enter',
					leaveAnimation: 'modal-detail-card-transition-leave'
				});
				modalDetailProfile.present();
			}else{
				let modalDetailProfile: any = this.modalCtrl.create('DetailProfileEmployeePage', { employee: profile.user }, {
					showBackdrop: false,
					cssClass: 'modal-page-detail-profile',
					enterAnimation: 'modal-detail-card-transition-enter',
					leaveAnimation: 'modal-detail-card-transition-leave'
				});
				modalDetailProfile.present();
			}
		});
	}

	callThePerson(item: any): void {
		if (item.contactPhone) {
			this.callNumber.callNumber(item.contactPhone, false);
		}
	}

	retrieveProfileFromSV(userId: number, retrieved: (profile: any) => void): void {
		let profile: any = this.arrayFriendsList.find(f => f.userId === userId);
		if (profile) {
			retrieved(profile);
			return;
		}
		this.userProvider.getBasicInfo(userId).subscribe(response => {
				let profile: any = { name: '' };
				if (response.user.types.includes('employee')) {
					profile.userId = userId;
					profile.name = response.user.local.username || response.user.facebook.username || response.user.linkedIn.username || response.user.google.username || '';
					profile.card_avatar = 'assets/img/img-card.png';
                    profile.status = response.employee.occupation.value;
					profile.year_exp = response.employee.yearsOfExperience;
					profile.user = response.user;
					profile.types = 'employee';
					retrieved(profile);
				}
				else if (response.user.types.includes('employer')) {
					this.employerProfileProvider.getEmployerProfileByUserId(userId).subscribe(response1 => {
						profile.userId = userId;
						profile.card_avatar = 'assets/img/img-card-employer.jpg';
                    	profile.name = response.employer.businessName || response.employer.offices[0].businessName || '';
						profile.contactPhone = response1.contactPhone;
						profile.types = 'employer';
						profile.user = response.user;
						retrieved(profile);
					});
				}
			},
			error => {
				console.log('Error in retrieving user id');
				console.log(error);
			});
	}

	retrieveProfile(userId: number): void {
		this.retrieveProfileFromSV(userId, (profile: any): void => {
			if (!this.arrayFriendsList.find(f => f.userId === userId)) {
				this.arrayFriendsList.splice(0, 0, profile);
			}
		});
	}

    loadFriendRequests(): void {
        this.friendshipProvider.search(this.currentUserId, null, null, null, 'requested').subscribe(response => {

                response.items.forEach(u => {
                    if (!this.arrayFriendRequests.find(fr => fr.id === u.id)) {
                        this.arrayFriendRequests.push({
                            id: u.id,
                            avatar: 'assets/img/sm-stock02.png',
                        });
                    }
                });

            },
            error => {
                console.log('Error in retrieving matches');
                console.log(error);
            });
    }

    loadMessages(): void {
        this.messageProvider.search(this.currentUserId, null, null, null, null).subscribe(
        	response => {
                let messageList: any = response.items;

                this.messageProvider.search(null, this.currentUserId, null, null, 'new').subscribe(
                    response1 => {
                        messageList = messageList.concat(response1.items);

                        messageList.forEach(m => {
                        	let userId: number = m.senderUserId;
                        	let newMsg: boolean = false;
							if (userId === this.currentUserId) {
                        		userId = m.recipientUserId;
							} else {
                                newMsg = m.status === 'new';
							}

							let msgGrp: any = this.arrayMessageList.find(m => m.userId === userId);
							if (msgGrp === undefined) {
                                this.arrayMessageList.push({
                                    userId: userId,
                                    name: '',
                                    newMessageCount: newMsg ? 1 : 0,
                                    latestMessageDatetime: m.createdAt,
                                    latestMessage: m.text,
                                    avatar: 'assets/img/sm-stock01.png'
                                });

                                this.userProvider.get(userId).subscribe(response => {
                                        let msg: any = this.arrayMessageList.find(m => m.userId === response.id);
                                        msg.name = response.local.username;
                                    },
                                    error => {
                                        console.log('Error in retrieving user id');
                                        console.log(error);
                                    });
							} else {
                                if (newMsg) {
                                    msgGrp.newMessageCount += 1;
                                }
							}
                        });
                    },
                    error => {
                        console.log('Error in retrieving messages');
                        console.log(error);
                    });

			},
			error => {
                console.log('Error in retrieving messages');
                console.log(error);
            });
	}

    sendMessage(user: any): void {
		if (user.userId) {
            let modalMessage: any = this.modalCtrl.create('MessageAlert', { senderUserId: this.currentUserId, targetUser: user }, {
                enableBackdropDismiss: true
            });
            modalMessage.present();
            modalMessage.onDidDismiss((message: any) => {
                if (message) {
					this.messageProvider.create({
						'senderUserId': this.currentUserId,
						'recipientUserId': user.userId,
						'text': message
					}).subscribe(response => {}, error => {
                        console.log('Error in sending message');
                        console.log(error);
					});
                }
            });
        }
    }

	swiperFunc(index: number): void {
		this.indexCardSelected = index;
	}

}
