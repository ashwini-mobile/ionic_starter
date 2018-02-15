import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, AlertController } from 'ionic-angular';
import { DataSvcProvider } from '../../providers/data-svc/data-svc';
import { DragulaService } from 'ng2-dragula/ng2-dragula';
import { SlickCarouselComponent, SlickCarouselItem } from '../../components/slick-carousel/slick-carousel';
import { Dashboard } from '../dashboard/dashboard';
import * as $ from 'jquery';
import { LikeDislikeProvider } from '../../providers/like-dislike-provider';
import { InterviewProvider } from '../../providers/interview-provider';
import { UserProvider } from '../../providers/user-provider';
import { EmployeeProfileProvider } from '../../providers/employee-profile-provider';
import { BenchMatchProvider } from '../../providers/bench-match-provider';
import { EmployerBenchProvider } from '../../providers/employer-bench-provider';
import { EmployeeBenchProvider } from '../../providers/employee-bench-provider';
import { MatchProvider } from '../../providers/match-provider';
import { EmployerProfileProvider } from '../../providers/employer-profile-provider';
import { MessageProvider } from '../../providers/message-provider';
import { CallNumber } from '@ionic-native/call-number';

@IonicPage()
@Component({
	selector: 'page-benches',
	templateUrl: 'benches.html',
	providers: [DataSvcProvider, DragulaService]
})
export class Benches {
	public arrayBenches: any;
	private arrayFriends: any;
	private heightConentCard: number;
	private rootNavCtrl: NavController;
	private isShowModalYouLike: boolean;
	private isShowModallMatches: boolean;
	private heldForThreeSeconds: number = 3000;
	private itemWasClicked: any;

    private indexCardSelected: number = 0;
    private currentUserId: number;
    private currentUserType: string;
    private isLikeDislikesLoaded: boolean = false;
    private genericBenchProvider: any;
    private matchesBasedOnLikes: any = [];

	constructor(
		public nav: NavController,
		public navParams: NavParams,
		private userProvider: UserProvider,
		private employerProfileProvider: EmployerProfileProvider,
        private employeeProfileProvider: EmployeeProfileProvider,
		private likeDislikeProvider: LikeDislikeProvider,
		private interviewProvider: InterviewProvider,
		private matchProvider: MatchProvider,
		private benchMatchProvider: BenchMatchProvider,
		private employerBenchProvider: EmployerBenchProvider,
        private employeeBenchProvider: EmployeeBenchProvider,
		private messageProvider: MessageProvider,
		private dataSvc: DataSvcProvider,
		private dragulaService: DragulaService,
		private dashboardCtr: Dashboard,
		public modalCtrl: ModalController,
		public alertCtrl: AlertController,
		private callNumber: CallNumber
	) {
		this.rootNavCtrl = navParams.get('rootNavCtrl');

        this.loadDataBenches();

        this.userProvider.getCurrentUser().subscribe(
            response => {
                this.currentUserId = response.id;
                this.currentUserType = response.types[0];

                if (this.currentUserType === 'employer') {
                    this.genericBenchProvider = this.employerBenchProvider;
                } else {
                    this.genericBenchProvider = this.employeeBenchProvider;
                }

                this.loadBenchMatches();
                this.loadLikeDislikes();
                this.loadBenches();
                this.isLikeDislikesLoaded = true;
            },
            error => {
                console.log('Error in retrieving current user info');
                console.log(JSON.stringify(error));
            }
        );

		let that: any = this;
		document.body.addEventListener('mousedown', function (e: any): void {
			that.itemWasClicked = new Date() ;
		});

		/*
		dragulaService.setOptions('item-list', {
			revertOnSpill: true, liftDelay: 700
		});
        */

        dragulaService.setOptions('eighth-bag', {
            revertOnSpill: true, copy: true, direction: 'vertical', liftDelay: 700
        });

        dragulaService.dropModel.subscribe((value: any) => {
            console.log(`dropModel: ${value[0]}`);
			this.onDropModel(value.slice(1));
		});
		dragulaService.removeModel.subscribe((value: any) => {
            console.log(`removeModel: ${value[0]}`);
			this.onRemoveModel(value.slice(1));
		});

		dragulaService.drag.subscribe((value: any, event: any) => {
			console.log(`drag: ${value[0]}`);
			console.log(event);
		});
		dragulaService.drop.subscribe((value: any) => {
			console.log(`drop: ${value[0]}`);
			if (value[0] === 'eighth-bag') {
                dragulaService.find(value[0]).drake.cancel(true);
                if (value[2] && value[2].id) {
                    // console.log('Selected Bench ID ' + value[2].id);
                    this.addToBench(value[2].id);
                }
            }
		});
		dragulaService.over.subscribe((value: any) => {
			console.log(`over: ${value[0]}`);
		});
		dragulaService.out.subscribe((value: any) => {
			console.log(`out: ${value[0]}`);
		});
	}

	private onDropModel(args: any): void {
		let [el, target, source] = args;
		// do something else
	}

 	private onRemoveModel(args: any): void {
		let [el, source] = args;
		// do something else
	}
	loadDataBenches(): void {
		this.dataSvc.loadDataBenches().then(data => {
			this.arrayBenches = data;
		});
		//list friend
        /*
		this.dataSvc.loadFriendsList().then(data => {
			this.arrayFriends = data;
		});
		*/
        this.arrayFriends = [];
	}

	ionViewDidLoad(): void {
		this.heightConentCard = window.screen.height - 365;
	}

	ionViewDidEnter(): void {
 		$('.touch-button').remove();
        this.loadLikeDislikes();
        this.loadBenches();
	}

	callThePerson(item: any): void {
		if (item.contactPhone) {
			this.callNumber.callNumber(item.contactPhone, false);
		}
	}

    loadBenchMatches(): void {
        this.benchMatchProvider.getByUserId(this.currentUserId).subscribe(response => {
                let matchList: any = response.items;
                matchList.forEach(u => {
                    let userId: number = this.currentUserType === 'employer' ? u.employeeUserId : u.employerUserId;
                    this.userProvider.getBasicInfo(userId).subscribe(response => {
                            if (response.user.types[0] === 'employee') {
                                let profile: any = { 'name': response.user.local.username };
                                profile.userId = userId;
                                profile.card_avatar = 'assets/img/img-card.png';
                                profile.status = response.employee.occupation.value;
                                profile.year_exp = response.employee.yearsOfExperience;
                                profile.profileId = response.employee.id;
                                this.arrayFriends.splice(0, 0, profile);

                            } else if (response.user.types[0] === 'employer') {
                                let profile: any = { 'name': response.employer.offices[0].businessName };
                                profile.userId = userId;
                                profile.card_avatar = 'assets/img/img-card-employer.jpg';
                                profile.profileId = response.employer.id;
                                this.arrayFriends.splice(0, 0, profile);
                            }

                        },
                        error => {
                            console.log('Error in retrieving user id');
                            console.log(JSON.stringify(error));
                        });
                });

            },
            error => {
                console.log('Error in retrieving bench matches');
                console.log(JSON.stringify(error));
            });
    }

    loadBenches(): void {
	    this.genericBenchProvider.search(this.currentUserId, null).subscribe(response => {
	        response.items.forEach(b => {
	            let bench: any = this.arrayBenches.find(bb => bb.id === b.id);
	            if (!bench) {
                    bench = {
                        id: b.id,
                        title: b.name,
                        friends: []
                    };
                    this.arrayBenches.push(bench);
                    if (this.currentUserType === 'employer') {
                        this.populateEmployees(bench, b.employees);
                    } else {
                        this.populateEmployers(bench, b.employers);
                    }
                }
            });
        }, error => {
            console.log('Error in retrieving benches');
            console.log(JSON.stringify(error));
        });
    }

    populateEmployees(bench: any, employees: any): void {
	    employees.forEach(e => {
	        let friend: any = {
                userId: e.userId,
                avata: 'assets/img/sm-stock01.png',
                name: '',
                status: e.occupation.value
            };
	        bench.friends.push(friend);

            this.userProvider.get(e.userId).subscribe(response => {
                let friend: any = bench.friends.find(f => f.userId === response.id);
                friend.name = response.local.username;

            }, error => {
                console.log('Error in retrieving info for userId ' + e.userId);
                console.log(JSON.stringify(error));
            });
        });
	    bench.matches = bench.friends.length;
    }

    populateEmployers(bench: any, employers: any): void {
        employers.forEach(e => {
            let friend: any = {
                userId: e.userId,
                avata: 'assets/img/id38-thumb.png',
                name: e.businessName,
                status: ''
            };
            bench.friends.push(friend);
        });
        bench.matches = bench.friends.length;
    }

    loadLikeDislikes(): void {
        this.matchesBasedOnLikes = [];

	    this.likeDislikeProvider.get(this.currentUserId, null).subscribe(response => {
            let bench: any = this.arrayBenches.find(b => b.title === 'You Like');
            bench.friends = [];
            this.populateLikeDislikeToUserInfo(bench, response.items);
        }, error => {
            console.log('Error in retrieving likes');
            console.log(JSON.stringify(error));
        });

        this.likeDislikeProvider.get(null, this.currentUserId).subscribe(response => {
            let bench: any = this.arrayBenches.find(b => b.title === 'Likes You');
            bench.friends = [];
            this.populateLikeDislikeToUserInfo(bench, response.items);
        }, error => {
            console.log('Error in retrieving likes');
            console.log(JSON.stringify(error));
        });
    }

    populateLikeDislikeToUserInfo(bench: any, likeDislikeInfo: any): void {
        likeDislikeInfo.filter(i => i.like).forEach(i => {
            let userId: number = this.currentUserId !== i.targetUserId ? i.targetUserId : i.requestorUserId;
            bench.friends.push({
                userId: userId
            });

            this.userProvider.getBasicInfo(userId).subscribe(response => {
                let friend: any = bench.friends.find(f => f.userId === userId);

                // Logic for matching likes
                let match: any = this.matchesBasedOnLikes.find(f => f.userId === userId);
                if (response.user.types[0] !== this.currentUserType) {
                    if (match === undefined) {
                        match = {
                            userId: userId,
                            count: 1
                        };
                        this.matchesBasedOnLikes.push(match);
                    } else {
                        match.count += 1;
                    }
                }

                if (response.user.types[0] === 'employee') {
                    friend.name = response.user.local.username;
                    friend.avata = 'assets/img/sm-stock01.png';
                    friend.status = response.employee.occupation !== null ? response.employee.occupation.value : '';

                    // Populate as new match
                    if (match && match.count === 2) {
                        delete match.count;
                        match.name = friend.name;
                        match.card_avatar = 'assets/img/img-card.png';
                        match.status = response.employee.occupation.value;
                        match.year_exp = response.employee.yearsOfExperience;
                        match.profileId = response.employee.id;
                        this.arrayFriends.splice(0, 0, match);
                    }
                } else if (response.user.types[0] === 'employer') {
			this.employerProfileProvider.getEmployerProfileByUserId(userId).subscribe(response1 => {
						    friend.avata = 'assets/img/id38-thumb.png';
						    friend.name = response.employer.offices[0].businessName;

						    // Populate as new match
						    if (match && match.count === 2) {
							delete match.count;
							match.name = friend.name;
							match.card_avatar = 'assets/img/img-card-employer.jpg';
							match.profileId = response.employer.id;
							match.contactPhone = response1.contactPhone;
							console.log('adding in employer');
							this.arrayFriends.splice(0, 0, match);
						    }
					});
                }

            }, error => {
                console.log('Error in retrieving info for userId ' + userId);
                console.log(JSON.stringify(error));
            });

        });
        bench.matches = bench.friends.length;
    }

	//go Benches Detail
	goBenchesDetail(item: any): void {
		if (item.title === 'You Like'){
			this.showBenchYouLikeMoDal(item);
		}else{
			this.showBenchMatchesMoDal(item);
		}
	}
	showBenchYouLikeMoDal(benches: any): void {
		let modalYouLike: any = this.modalCtrl.create('BenchesYouLikePage', { arrayFriends: benches, currentUserId: this.currentUserId }, {
            showBackdrop: false,
            cssClass: 'modal-page-you-like',
            enterAnimation: 'modal-transition-enter-ios',
            leaveAnimation: 'modal-transition-leave'
        });
		// alertModal callback
		modalYouLike.onDidDismiss((data: any) => {
			this.isShowModalYouLike = false;
		});
		modalYouLike.present();
		this.isShowModalYouLike = true;
	}

	showBenchMatchesMoDal(benches: any): void {
		let modalMatches: any = this.modalCtrl.create('BenchesMatchesPage', { arrayFriends: benches, currentUserId: this.currentUserId }, {
            showBackdrop: false,
            cssClass: 'modal-page-matches',
            enterAnimation: 'modal-transition-enter-ios',
            leaveAnimation: 'modal-transition-leave'
        });
		// alertModal callback
		modalMatches.onDidDismiss((data: any) => {
			this.isShowModallMatches = false;
		});
		modalMatches.present();
		this.isShowModallMatches = true;
	}

	// show modal SOS
	showModalSOS(): void {
		let modalSos: any = this.modalCtrl.create('SosAlert', {}, {cssClass: 'modal-sos-alert'});
		// alertModal callback
		modalSos.onDidDismiss((data: any) => {
		});
		modalSos.present();
	}

	//add benches
	addBenches(): void {
		let modalAddBenches: any = this.modalCtrl.create('BenchesAddAlertPage', {}, {cssClass: 'modal-add-benches-alert'});
		// alertModal callback
		modalAddBenches.onDidDismiss((data: any) => {
		    let input: any = { 'name': data.title };
		    if (this.currentUserType === 'employer') {
		        input.employees = [];
            } else {
		        input.employers = [];
            }

		    this.genericBenchProvider.create(input).subscribe(response => {
                this.loadBenches();
            }, error => {
                console.log('Error creating bench');
                console.log(JSON.stringify(error));
            });
		});
		modalAddBenches.present();
	}

	clickPointEdit(indexItem: number): void {
	    if (this.arrayBenches[indexItem].title === 'You Like' || this.arrayBenches[indexItem].title === 'Likes You' || this.arrayBenches[indexItem].title === 'Watch Later') {
	        return;
        }

		let modalEditPoint: any = this.modalCtrl.create('BenchesAlertPage', {benches: this.arrayBenches[indexItem].title}, {cssClass: 'modal-edit-point-alert'});
		// alertModal callback
        modalEditPoint.onDidDismiss((result: any) => {
            if (result.action === 'rename') {
                this.arrayBenches[indexItem].title = result.data;
            } else if (result.action === 'delete') {
                let bench: any = this.arrayBenches[indexItem];
                this.genericBenchProvider.delete(bench.id).subscribe(response => {
                    this.arrayBenches.splice(indexItem, 1);
                }, error => {
                    console.log('Error deleting bench');
                    console.log(JSON.stringify(error));
                });
            }
        });
		modalEditPoint.present();
	}

    swiperFunc(index: number): void {
        this.indexCardSelected = index;
    }

    addToBench(benchId: number): void {
        let item: any = this.arrayFriends[this.indexCardSelected];
        if (item.profileId) {
            if (this.currentUserType === 'employee') {
                this.employeeBenchProvider.addEmployerToBench(benchId, item.profileId).subscribe(response => {
                        this.loadBenches();
                    },
                    error => {
                        this.loadBenches();
                        console.log('Error adding employer to bench');
                        // console.log(JSON.stringify(error));
                    });
            } else {
                this.employerBenchProvider.addEmployeeToBench(benchId, item.profileId).subscribe(response => {
                        this.loadBenches();
                    },
                    error => {
                        this.loadBenches();
                        console.log('Error adding employee to bench');
                        // console.log(JSON.stringify(error));
                    });
            }
        }
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
						console.log(JSON.stringify(error));
					});
				}
			});
		}
	}

}
