import { Component, OnInit, ViewChild, ElementRef , AfterViewInit} from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ModalController, Platform, ActionSheetController, normalizeURL } from 'ionic-angular';
import { DataSvcProvider } from '../../providers/data-svc/data-svc';
import { Validator } from '@angular/forms';
import { EmployerProfileProvider } from '../../providers/employer-profile-provider';
import { EmployerProfile } from '../../models/employer-profile';
import {UserProvider} from '../../providers/user-provider';
import { SubscriptionProvider } from '../../providers/subscription-provider';
import { Camera, CameraOptions } from '@ionic-native/camera';
import * as _ from 'lodash';

declare var google: any;
/**
 * Generated class for the ProfileAlertPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
	selector: 'page-edit-profile',
	templateUrl: 'edit-profile.html',
    host: {
        '(document:click)': 'onClick($event)',
    }
})
export class EditProfilePage implements OnInit {
	private dataChart: any;
	private dataProfileDetail: any;
	private employerProfile: any = new EmployerProfile();

	private isSubcription: boolean = false;
	private isEditAboutUs: boolean = false;
	private isShowEditPhone: boolean = false;
	private isShowEditEmail: boolean = false;
	private isShowEditWebsite: boolean = false;

	private errorPhone: boolean = false;
	private errorEmail: boolean = false;
	private errorWebsite: boolean = false;

	private limitInternalFriends: number = 7;
	private limitExternalFriends: number = 7;
	private isShowVMInternal: boolean = false;
	private isShowVMExternal: boolean = false;

	private isShowName: boolean = false;

	@ViewChild('mapElement') mapElement: ElementRef;
  private map: any;
	@ViewChild('phoneInput') phoneInput: any;
	@ViewChild('emailInput') emailInput: any;
	@ViewChild('websiteInput') websiteInput: any;
	@ViewChild('secondLineChart') secondLineChart: any;
	@ViewChild('secondRightElChart') secondRightElChart: any;
	@ViewChild('secondLeftElChart') secondLeftElChart: any;
	constructor(
			public navCtrl: NavController,
			public navParams: NavParams,
			public viewCtrl: ViewController,
			private svcService: DataSvcProvider,
			private userProvider: UserProvider,
			private employerProfileProvider: EmployerProfileProvider,
			private subscriptionProvider: SubscriptionProvider,
			private modal: ModalController,
			public actionSheetCtrl: ActionSheetController,
			private _eref: ElementRef,
			private camera: Camera,
			private platform: Platform
	) {}
	ngOnInit(): void {
		this.svcService.loadDataChart().then(res => {
			this.dataChart = res;
		});
		this.svcService.loadProfileDetail().then(res => {
			this.dataProfileDetail = res;
			_.forEach(this.dataProfileDetail.images, (image) => {
                if (!image.url) {
                    image.url = image.image;
                }
			});
			this.subscriptionProvider.getSubscriptions().subscribe(res => {
				this.userProvider.getCurrentUser().subscribe(response => {
                    this.employerProfileProvider.getEmployerProfileByUserId(response.id)
                        .subscribe(response => {
							this.employerProfile = response;
							this.dataProfileDetail.profileSubscription = this.employerProfile.profileSubscription;
							this.loadMap();

							console.log(JSON.stringify(this.employerProfile.photos));
							this.convertDataToChart(this.employerProfile.employeeOrganization);
						},
					error => {
						console.log('Error in retrieving employer profile');
						console.log(error);
					});
				},
                    error => {
                        console.log('Error in retrieving current user info');
                        console.log(error);
                    });


			});
		});
		this.svcService.getSubcriptionVariable().then(res => {
			this.isSubcription = res;
		});
	}

	// dismiss
	dimissFunc(): void {
        this.convertChartToData();
        this.cleanupSchedule();
		this.prepareToSaveSubscription();
        this.removeNulls();
        console.log(JSON.stringify(this.employerProfile));
		this.employerProfileProvider.updateEmployerProfile(this.employerProfile).subscribe(response => {
                this.viewCtrl.dismiss();
            },
			error => {
                this.viewCtrl.dismiss();
			});
	}

	prepareToSaveSubscription(): void {
		/*this.employerProfile.profileSubscription = {};
		let subscription: any = {
			subscription: {
				id: 0
			}
		};
		if (this.dataProfileDetail && this.dataProfileDetail.profileSubscription && this.dataProfileDetail.profileSubscription.subscription && this.dataProfileDetail.profileSubscription.subscription.id) {
			subscription.subscription.id = this.dataProfileDetail.profileSubscription.subscription.id;
		}
		this.employerProfile.profileSubscription = subscription;*/
		if (this.employerProfile.hasOwnProperty('profileSubscription')) {
			if (this.employerProfile.profileSubscription !== null) {

				delete this.employerProfile.profileSubscription.id;
				delete this.employerProfile.profileSubscription.subscriptionId;
				delete this.employerProfile.profileSubscription.expiredAt;
				delete this.employerProfile.profileSubscription.updatedAt;
				delete this.employerProfile.profileSubscription.createdAt;
				delete this.employerProfile.profileSubscription.subscription.pricePerMonth;
				delete this.employerProfile.profileSubscription.subscription.numberOfMonth;
				delete this.employerProfile.profileSubscription.subscription.discount;
				delete this.employerProfile.profileSubscription.subscription.title;
				delete this.employerProfile.profileSubscription.subscription.description;
			}
			else {
				delete this.employerProfile.profileSubscription;
			}
		}
    	}

	// delete admin
	deletedAdminFunc(index: number): void {
		this.dataProfileDetail.administrators.splice(index, 1);
	}
	// edit subcription
	editSubscriptionFunc(): void {
		let editSubcription: any = this.modal.create('SelectSubscriptionAlert', {}, {cssClass: 'modal-select-scription'});
		editSubcription.present();
		editSubcription.onDidDismiss((data: any) => {
			if (data) {
				this.employerProfile.profileSubscription = {subscription: {}};
				this.dataProfileDetail.profileSubscription = {subscription: {}};
				this.employerProfile.profileSubscription.subscription.id = data.id;
				this.employerProfile.profileSubscription.subscription.pricePerMonth = data.pricePerMonth;
				this.employerProfile.profileSubscription.subscription.title = data.title;
				this.dataProfileDetail.profileSubscription.subscription.id = data.id;
				this.dataProfileDetail.profileSubscription.subscription.pricePerMonth = data.pricePerMonth;
				this.dataProfileDetail.profileSubscription.subscription.title = data.title;
			}
		});
	}
	// delete Photo
	deletePhoto(index: number): void {
		if (this.dataProfileDetail.images.length > 1) {
			this.dataProfileDetail.images.splice(index, 1);
		}
	}

	addPhoto(id: any): void {
		let profileModal: any = this.modal.create('ProfileAlertPage', {
			title: 'Import Photos',
			link: [
				{
						text: 'Google Photos',
						class: 'gPlus'
				},
				{
						text: 'Instagram',
						class: 'instagram'
				},
				{
						text: 'Photos',
						class: 'photos'
				},
				{
						text: 'Facebook',
						class: 'fb'
				},
				{
						text: 'Device Camera',
						class: 'photos'
				}
			]
		});

		// profileModal callback
		profileModal.onDidDismiss((data: any) => {
					/*let imageObj: any = {
			    'image': 'assets/img/house03.jpg'
			};
			this.dataProfileDetail.images.push(imageObj);*/
			if (data === 'Device Camera') {
				const options: CameraOptions = {
					quality: 100,
					destinationType: this.platform.is('ios') ? this.camera.DestinationType.FILE_URI : this.camera.DestinationType.DATA_URL,
					  encodingType: this.camera.EncodingType.JPEG,
					  mediaType: this.camera.MediaType.PICTURE,
					targetWidth: 58,
        				targetHeight: 58
				};

				this.camera.getPicture(options).then((imageData) => {
					let base64Image: any = null;
					if (this.platform.is('ios')) {
						base64Image = normalizeURL(imageData);
					}
					else {
						base64Image = 'data:image/jpeg;base64,' + imageData;
					}
					let imageObj: any = {
		    			'image': base64Image
						};
					this.dataProfileDetail.images.push(imageObj);
				}, (error) => {
					console.log(error);
				});
			}
		});

		profileModal.present();
	}

	// add New Endorement Func
	addNewEndorementFunc(): void {
		let modalEndorsementsPage: any = this.modal.create('EndorsementsPage', {}, { showBackdrop: true, cssClass: 'modal-endorsements-profile' });
		modalEndorsementsPage.present();
	}
	// show modal add Funcition
	showModalAddFunc(type: string): void {
		let modalShareProfile: any = this.modal.create('EditListAlert', { softData: this.dataProfileDetail, typePopup: type, softDataEmplyrPrfle: this.employerProfile}, { showBackdrop: true, cssClass: 'modal-share-profile' });
		modalShareProfile.present();
		modalShareProfile.onDidDismiss((data: any) => {
				if (type === 'admin') {
						this.dataProfileDetail.administrators = data;
				}else if (type === 'dentalPhilEmplyrEdit') {
						this.dataProfileDetail.dentalPhil = data;
				}else if (type === 'techUse') {
					this.dataProfileDetail.technolegies = data;
				}else if (type === 'position') {
					this.dataProfileDetail.position = data;
				}
		});
	}
	// change date nghi bug 5
	changeStartDate(index: number): any {
		if (index === 0) {
			for (let i: number = 1; i < 5; i++) {
				this.dataProfileDetail.workAbility[i].start = this.dataProfileDetail.workAbility[0].start;
				// if (this.dataProfileDetail.workAbility[i].start === '') {
				// }
			}
		}
	}
	changeEndDate(index: number): any {
		if (index === 0) {
			for (let i: number = 1; i < 5; i++) {
				// if (this.dataProfileDetail.workAbility[i].end === '') {
					this.dataProfileDetail.workAbility[i].end = this.dataProfileDetail.workAbility[0].end;
				// }
			}
		}
	}

	loadMap(): void {
		let latLng: any = new google.maps.LatLng(this.dataProfileDetail.geo.lat, this.dataProfileDetail.geo.long);
		let mapOptions: any = {
			center: latLng,
			zoom: 15,
			disableDefaultUI: true,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		};
		this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
		let marker: any = new google.maps.Marker({
			position: latLng,
			map: this.map,
			icon: 'assets/img/marker.png'
		});
	}

	convertDataToChart(org: any): void {
		this.dataChart.orgId = org.id;
		this.dataChart.id = org.root.id;
        this.dataChart.name = org.root.title;
        this.dataChart.branches = [];
        org.root.children.forEach(b => {
        	const branch: any = {
        		id: b.id,
				name: b.title,
				sections: [],
			};
        	b.children.forEach(s => {
        		if (s.title !== null) {
                    const section: any = {
                        id: s.id,
                        name: s.title,
                        groups: [],
                    };
                    s.children.forEach(g => {
                    	if (g.title !== null) {
                            section.groups.push({
                                id: g.id,
                                name: g.title,
                            });
                        }
                    });
                    branch.sections.push(section);
                }
			});
            this.dataChart.branches.push(branch);
		});
	}

	convertChartToData(): void {
		const org: any = this.employerProfile.employeeOrganization;
		org.id = this.dataChart.orgId;
		org.root.title = this.dataChart.name;
        org.root.id = this.dataChart.id;
        org.root.children = [];
        this.dataChart.branches.forEach(b => {
            const childBranch: any = {
                title: b.name,
                children: [],
            };
            if (b.id) {
                childBranch.id = b.id;
            }

            b.sections.forEach(s => {
                const childSection: any = {
                    title: s.name,
                    children: [],
                };
                if (s.id) {
                    childSection.id = s.id;
                }

                s.groups.forEach(g => {
                	const childGroup: any = {
                        title: g.name,
					};
					if (g.id) {
                        childGroup.id = g.id;
					}

                    childSection.children.push({ title: g.name});
                });
                childBranch.children.push(childSection);
            });
            this.employerProfile.employeeOrganization.root.children.push(childBranch);
        });
    }

    cleanupSchedule(): void {
		const s: any = this.employerProfile.schedule;
		s.mondayStart = s.mondayStart.substring(0, 5);
        s.mondayEnd = s.mondayEnd.substring(0, 5);
        s.tuesdayStart = s.tuesdayStart.substring(0, 5);
        s.tuesdayEnd = s.tuesdayEnd.substring(0, 5);
        s.wednesdayStart = s.wednesdayStart.substring(0, 5);
        s.wednesdayEnd = s.wednesdayEnd.substring(0, 5);
        s.thursdayStart = s.thursdayStart.substring(0, 5);
        s.thursdayEnd = s.thursdayEnd.substring(0, 5);
        s.fridayStart = s.fridayStart.substring(0, 5);
        s.fridayEnd = s.fridayEnd.substring(0, 5);
        s.saturdayStart = s.saturdayStart.substring(0, 5);
        s.saturdayEnd = s.saturdayEnd.substring(0, 5);
        s.sundayStart = s.sundayStart.substring(0, 5);
        s.sundayEnd = s.sundayEnd.substring(0, 5);
	}

    removeNulls(): void {
		delete this.employerProfile.status;

		delete this.employerProfile.industryId;
		delete this.employerProfile.facebookReviewsLink;
        delete this.employerProfile.googleReviewsLink;
        delete this.employerProfile.yelpReviewsLink;
        delete this.employerProfile.accountType;
        delete this.employerProfile.preferredContactOption;
        delete this.employerProfile.alternateContactOption;
		delete this.employerProfile.schedule.employerUserId;
		this.employerProfile.profileQuestionAnswers.forEach(q => {
			delete q.employeeProfileId;
			delete q.questionId;

			if (!q.otherAnswer) {
				delete q.otherAnswer;
			}
        });

        this.employerProfile.specializations.forEach(s => delete s.numInList );
        this.employerProfile.areasToStaff.forEach(s => delete s.numInList );

		if (!this.employerProfile.otherAreasToStaff) {
			delete this.employerProfile.otherAreaToStaff;
		}
	}

	editPhoneFunc(event: any): void {
		event.stopPropagation();
		if (this.isShowEditPhone) {
			this.errorPhone = this.phoneInput.hasError('required');
			if (!this.errorPhone) {
				this.isShowEditPhone = ! this.isShowEditPhone;
			}
		} else {
			this.isShowEditPhone = ! this.isShowEditPhone;
		}
	}
	editEmailFunc(event: any): void {
		event.stopPropagation();
		if (this.isShowEditEmail) {
			this.errorEmail = (this.emailInput.hasError('required') || this.emailInput.hasError('email'));
			if (!this.errorEmail) {
				this.isShowEditEmail = ! this.isShowEditEmail;
			}
		} else {
			this.isShowEditEmail = ! this.isShowEditEmail;
		}
	}
	editWebsiteFunc(event: any): void {
		event.stopPropagation();
		if (this.isShowEditWebsite) {
			this.errorWebsite = this.websiteInput.hasError('required');
			if (!this.errorWebsite) {
				this.isShowEditWebsite = ! this.isShowEditWebsite;
			}
		} else {
			this.isShowEditWebsite = ! this.isShowEditWebsite;
		}
	}

	// remove error
	removeErrorFunc(event: any, type: string): void {
		event.stopPropagation();
		if (type === 'phone') {
			this.errorPhone = false;
		}else if (type === 'email') {
			this.errorEmail = false;
		}else{
			this.errorWebsite = false;
		}
	}

	// click body
	onClick(event: any): void {
		this.isShowEditPhone = false;
		this.isShowEditEmail = false;
		this.isShowEditWebsite = false;
		this.isEditAboutUs = false;
	}

	// add Branch Before
	addBranchBefore(): void {
		let branchTemp: any = {
			name: '',
			sections: [
				{
					name: '',
					groups: []
				}
			]
		};
		this.dataChart.branches.splice(0, 0, branchTemp);
	}

	// add Branch after
	addBranchafter(): void {
		let branchTemp: any = {
			name: '',
			sections: [
				{
					name: '',
					groups: []
				}
			]
		};
		this.dataChart.branches.push(branchTemp);
		this.fixLineChart();
	}

	// add Section
	addSection(branch: any): void {
		let sectionTemp: any = {
			name: '',
			groups: []
		};
		branch.sections.push(sectionTemp);
		this.fixLineChart();
	}

	fixLineChart(): void {
		let that: any = this;
		setTimeout(function(): void {
			that.secondLineChart.nativeElement.style.left = that.secondLeftElChart.nativeElement.offsetLeft + 10 + 'px';
			that.secondLineChart.nativeElement.style.right = that.secondRightElChart.nativeElement.offsetLeft + 10 + 'px';
		}, 150);
	}
	// add Group
	addGroup(section: any): void {
		section.groups.push({name: ''});
	}

	// check branch
	checkBranch(branch: any): boolean {
		for ( let section of branch.sections) {
			if (section.name !== '') {
				return false;
			}
		}
		return true;
	}
	// check section
	checkSection(branch: any): boolean {
		let count: number = 0;
		for (let section of branch.sections) {
			if (section.name !== '') {
				count++;
			}
		}
		if (count > 1) {
			return false;
		}else{
			return true;
		}
	}
	showModalShareFunc(): void {
		// let modalShareProfile: any = this.modal.create('ShareAlert', {}, { showBackdrop: true, cssClass: 'modal-share-profile' });
		// modalShareProfile.present();
		let actionSheet: any = this.actionSheetCtrl.create({
			title: 'Tap to Share',
			buttons: [
				{
					text: 'One Dental Match',
					handler: () => {
						console.log('One Dental Match clicked');
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
}
