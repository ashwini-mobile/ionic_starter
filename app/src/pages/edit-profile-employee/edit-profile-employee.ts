import { Component, ElementRef, ViewChild } from '@angular/core';
import { DatePipe } from '@angular/common';
import { IonicPage, NavController, NavParams, ViewController, ModalController, ActionSheetController } from 'ionic-angular';
import { DataSvcProvider } from '../../providers/data-svc/data-svc';
import { EmployeeProfileProvider } from '../../providers/employee-profile-provider';
import { UserProvider } from '../../providers/user-provider';
import { EmployeeProfile } from '../../models/employee-profile';
import { LookupProvider } from '../../providers/lookup-provider';
import { SubscriptionProvider } from '../../providers/subscription-provider';
import { EmployerProfileProvider } from '../../providers/employer-profile-provider';
import * as _ from 'lodash';
/**
 * Generated class for the ProfileAlertPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-edit-profile-employee',
    templateUrl: 'edit-profile-employee.html',
    host: {
        '(document:click)': 'onClick($event)',
    },
    providers: [DatePipe]
})
export class EditProfileEmployeePage {
    private dataProfileDetail: any;
    private employeeProfile: any = new EmployeeProfile();
    private questions: any = [];

    private questionSoftSkill: string = 'Which Dental Practice Management Software are you proficient at ?';
    private questionTechSkill: string = 'Dental Technology Skills';
    private questionOtherSoft: string = 'What other Technologies/Software are you familiar with ?';
    private questionGeneralSkill: string = 'General Skills';
    private questionAdminSkill: string = 'Administrative Skills';
    private questionDentalPhil: string = 'What Dental Philosophy/Training do you have ?';

    private isSubcription: boolean = false;
    private isEditDescInfo: boolean = false;
    private limitExternalFriend: number = 7;
    private isShowViewMoreFriend: boolean = false;

    @ViewChild('titleInput') titleInput: any;
	@ViewChild('noteInput') noteInput: any;
    @ViewChild('yearInput') yearInput: any;

    @ViewChild('titleInputClone') titleInputClone: any;
	@ViewChild('noteInputClone') noteInputClone: any;
    @ViewChild('yearInputClone') yearInputClone: any;

    private errorTitle: boolean = false;
	private errorNote: boolean = false;
    private errorYear: boolean = false;

    private errorTitleClone: boolean = false;
	private errorNoteClone: boolean = false;
    private errorYearClone: boolean = false;

    private isShowEditEmployment: boolean = false;
    private isShowEditEmploymentClone: boolean = false;
	private userId: any;
 	private isEmployerToo: boolean = false;
 	private employerId: number;
    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public viewCtrl: ViewController,
        private userProvider: UserProvider,
        private employeeProfileProvider: EmployeeProfileProvider,
	private employerProfileProvider: EmployerProfileProvider,
        private lookupProvider: LookupProvider,
	private subscriptionProvider: SubscriptionProvider,
        private svcService: DataSvcProvider,
        private modal: ModalController,
        private datePipe: DatePipe,
        public actionSheetCtrl: ActionSheetController,
        private _eref: ElementRef
    ) {}

    ngOnInit(): void {
        this.svcService.loadProfileDetailEmployee().then(res => {
            this.dataProfileDetail = res;
			_.forEach(this.dataProfileDetail.images, (image) => {
                if (!image.url) {
                    image.url = image.image;
                }
			});
            this.subscriptionProvider.getSubscriptions().subscribe(res => {
                for (let item of res) {
                    if (this.dataProfileDetail.subcriptionID === item.id) {
                            this.dataProfileDetail.subcription = item;
                    }
                }

                this.userProvider.getCurrentUser(false).subscribe(response => {
                        this.dataProfileDetail.name = response.local.username;
			this.userId = response.id;
                        this.employeeProfileProvider.getEmployeeProfileByUserId(response.id)
                            .subscribe(response => {
                                this.employeeProfile = response;
                                if (this.employeeProfile.photos && this.employeeProfile.photos.length === 0) {
                                    this.employeeProfile.photos.push({
                                        url: 'assets/img/profile-00.png'
                                    });
                                }
                                this.dataProfileDetail.profileSubscription = this.employeeProfile.profileSubscription;
                                console.log(this.employeeProfile);
                                this.checkIfEmployerAndUpdateSubscriptions();
                                this.populateFixedInfo();
                                this.populatedEmploymentHistory();
                                this.populatedEducationHistory();
                                this.loadQuestions();
                            },
                            error => {
                                console.log('Error in retrieving employee profile');
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

    ionViewDidLoad(): void {
        console.log('ionViewDidLoad OfficesAlertPage');
    }

	checkIfEmployerAndUpdateSubscriptions(): void {
 		this.userProvider.getBasicInfo(this.userId).subscribe(userObj => {
 			if (userObj.employer !== null) {
 				this.isEmployerToo = true;
 				this.employerId = userObj.employer.id;
 				this.updateSubscriptionUsingEmployerInstance();
 			}
 		});
 	}

	updateSubscriptionUsingEmployerInstance(): void {
 		this.employerProfileProvider.getEmployerProfileByUserId(this.userId)
                         .subscribe(response => {
				console.log(response);
 				this.employeeProfile.profileSubscription = response.profileSubscription;
 			});
 	}

	sendSubscriptionObjectforEmployer(): void {
		if (this.employeeProfile.hasOwnProperty('profileSubscription')) {
			if (this.employeeProfile.profileSubscription !== null) {
		 		delete this.employeeProfile.profileSubscription.id;
		 		delete this.employeeProfile.profileSubscription.subscriptionId;
		 		delete this.employeeProfile.profileSubscription.expiredAt;
		 		delete this.employeeProfile.profileSubscription.updatedAt;
		 		delete this.employeeProfile.profileSubscription.createdAt;
		 		delete this.employeeProfile.profileSubscription.subscription.pricePerMonth;
		 		delete this.employeeProfile.profileSubscription.subscription.numberOfMonth;
		 		delete this.employeeProfile.profileSubscription.subscription.discount;
		 		delete this.employeeProfile.profileSubscription.subscription.title;
		 		delete this.employeeProfile.profileSubscription.subscription.description;
		 		const employerObj: any = {
		 			id: this.employerId,
		 			profileSubscription: this.employeeProfile.profileSubscription
		 		};
		 		this.employerProfileProvider.updateEmployerProfile(employerObj).subscribe(response => {
				 		this.viewCtrl.dismiss();
			     		},
		 			error => {
		 				console.log(error);
		 			});
			}
		}
 	}

    // dismiss
    dismiss(): void {
        this.prepareToSaveEmploymentHistory();
        this.prepareToSaveEducationHistory();
	    this.prepareToSaveSubscription();
        this.prepareToSaveQuestionAndAnswerSet(this.questionSoftSkill, this.dataProfileDetail.practiceSoft);
        this.prepareToSaveQuestionAndAnswerSet(this.questionTechSkill, this.dataProfileDetail.dentalTechSkills);
        this.prepareToSaveQuestionAndAnswerSet(this.questionOtherSoft, this.dataProfileDetail.ortherSoft);
        this.prepareToSaveQuestionAndAnswerSet(this.questionGeneralSkill, this.dataProfileDetail.generalSkills);
        this.prepareToSaveQuestionAndAnswerSet(this.questionAdminSkill, this.dataProfileDetail.administrtiveSkill);
        this.prepareToSaveQuestionAndAnswerSet(this.questionDentalPhil, this.dataProfileDetail.dentalPhil);
        this.removeNulls();

         console.log(JSON.stringify(this.employeeProfile));
        this.employeeProfileProvider.updateEmployeeProfile(this.employeeProfile).subscribe(response => {
		if (this.isEmployerToo) {
 			this.sendSubscriptionObjectforEmployer();
 		}
                this.viewCtrl.dismiss();
            },
            error => {
                console.log(error);
                this.viewCtrl.dismiss();
            });
    }

    populateFixedInfo(): void {
        this.dataProfileDetail.description = this.employeeProfile.occupation.value;
        this.dataProfileDetail.city = this.employeeProfile.employeeLocation.locality;
        this.dataProfileDetail.state = this.employeeProfile.employeeLocation.state;
        this.dataProfileDetail.images = this.employeeProfile.photos;

        delete this.employeeProfile.occupation;
        delete this.employeeProfile.employeeLocation;
    }

    populatedEmploymentHistory(): void {
        this.dataProfileDetail.employmentHistory = [];
        this.employeeProfile.employementHistory.forEach(e => {
            const sd: Date = new Date(e.startDate);
            const ed: Date = new Date(e.endDate);
            const empHist: any = {
                ...e,
                // note: e.degree.charAt(0).toUpperCase() + e.degree.slice(1),
                year: this.datePipe.transform(sd, 'MM/yyyy') + ' - ' + this.datePipe.transform(ed, 'MM/yyyy'),
            };
            this.dataProfileDetail.employmentHistory.push(empHist);
        });
    }

    populatedEducationHistory(): void {
        this.dataProfileDetail.educationHistory = [];
        this.employeeProfile.educationHistory.forEach(e => {
            const sd: Date = new Date(e.startDate);
            const ed: Date = new Date(e.endDate);
            const eduHist: any = {
                ...e,
                note: e.degree.charAt(0).toUpperCase() + e.degree.slice(1),
                year: this.datePipe.transform(sd, 'MM/yyyy') + ' - ' + this.datePipe.transform(ed, 'MM/yyyy'),
            };
            this.dataProfileDetail.educationHistory.push(eduHist);
        });
    }

    loadQuestions(): void {
        this.lookupProvider.getQuestions('employeeProfile').then(data => {
            this.questions = data;

            this.dataProfileDetail.practiceSoft = this.selectCurrentAnswerSet(this.questionSoftSkill);
            this.dataProfileDetail.dentalTechSkills = this.selectCurrentAnswerSet(this.questionTechSkill);
            this.dataProfileDetail.ortherSoft = this.selectCurrentAnswerSet(this.questionOtherSoft);
            this.dataProfileDetail.generalSkills = this.selectCurrentAnswerSet(this.questionGeneralSkill);
            this.dataProfileDetail.administrtiveSkill = this.selectCurrentAnswerSet(this.questionAdminSkill);
            this.dataProfileDetail.dentalPhil = this.selectCurrentAnswerSet(this.questionDentalPhil);
        });
    }

    selectCurrentAnswerSet(questionText: string): any {
        const question: any = this.questions.items.find(q => q.text === questionText);
        if (question) {
            const profileQuestionAnswers: any = this.employeeProfile.profileQuestionAnswers.find(q => q.questionId === question.id);
            profileQuestionAnswers.selectedAnswerOptions.forEach(a => a.name = a.value);
            return profileQuestionAnswers.selectedAnswerOptions;
        }
        return [];
    }

    // show modal add Soft
    showModalAddFunc(type: string): void {
        let answerOptions: any = [];
        if (type === 'software') {
            answerOptions = this.selectQuestionAndAnswerSet(this.questionSoftSkill, this.dataProfileDetail.practiceSoft);
        } else if (type === 'techSkill') {
            answerOptions = this.selectQuestionAndAnswerSet(this.questionTechSkill, this.dataProfileDetail.dentalTechSkills);
        } else if (type === 'otherSoft') {
            answerOptions = this.selectQuestionAndAnswerSet(this.questionOtherSoft, this.dataProfileDetail.ortherSoft);
        } else if (type === 'generalSkill') {
            answerOptions = this.selectQuestionAndAnswerSet(this.questionGeneralSkill, this.dataProfileDetail.generalSkills);
        } else if (type === 'adminSkill') {
            answerOptions = this.selectQuestionAndAnswerSet(this.questionAdminSkill, this.dataProfileDetail.administrtiveSkill);
        } else if (type === 'dentalPhil') {
            answerOptions = this.selectQuestionAndAnswerSet(this.questionDentalPhil, this.dataProfileDetail.dentalPhil);
        }

        answerOptions.sort((left, right): number => {
            if (left.value < right.value) return -1;
            if (left.value > right.value) return 1;
            return 0;
        });
        let modalShareProfile: any = this.modal.create('EditListAlert', { softData: this.dataProfileDetail, typePopup: type, answerOptions: answerOptions }, { showBackdrop: true, cssClass: 'modal-share-profile' });
        modalShareProfile.present();
        modalShareProfile.onDidDismiss((data: any) => {
            if (data.length > 0) {
                if (type === 'software') {
                    this.dataProfileDetail.practiceSoft = data;
                } else if (type === 'techSkill') {
                    this.dataProfileDetail.dentalTechSkills = data;
                } else if (type === 'otherSoft') {
                    this.dataProfileDetail.ortherSoft = data;
                } else if (type === 'generalSkill') {
                    this.dataProfileDetail.generalSkills = data;
                } else if (type === 'adminSkill') {
                    this.dataProfileDetail.administrtiveSkill = data;
                } else if (type === 'dentalPhil') {
                    this.dataProfileDetail.dentalPhil = data;
                }
            }
        });
    }

    selectQuestionAndAnswerSet(questionText: string, currentAnswers: any): any {
        const question: any = this.questions.items.find(q => q.text === questionText);
        if (question) {
            const profileAnswerIds: any = currentAnswers.map(a => a.id);
            question.answerOptions.forEach(a => {
                a.isSelected = profileAnswerIds.includes(a.id);
                a.name = a.value;
            });
            return question.answerOptions;
        }
        return [];
    }

    prepareToSaveQuestionAndAnswerSet(questionText: string, currentAnswers: any): void {
        const question: any = this.questions.items.find(q => q.text === questionText);
        if (question) {
            const profileQuestion: any = this.employeeProfile.profileQuestionAnswers.find(q => q.questionId === question.id);
            profileQuestion.selectedAnswerOptions = currentAnswers;
            profileQuestion.selectedAnswerOptions.forEach(a => {
                delete a.isSelected;
                delete a.name;
            });
        }
    }

    prepareToSaveEmploymentHistory(): void {
        this.employeeProfile.employementHistory = [];
        this.dataProfileDetail.employmentHistory.forEach(e => {
            const dts: any = e.year.split('-');

            const sdStr: any = dts[0].split('/');
            const sd: string = sdStr[1].trim() + '-' + sdStr[0].trim();
            if (!e.startDate.startsWith(sd)) {
                e.startDate = sd + '-01';
            }

            const edStr: any = dts[1].split('/');
            const ed: string = edStr[1].trim() + '-' + edStr[0].trim();
            if (!e.endDate.startsWith(ed)) {
                e.endDate = ed + '-01';
            }

            const empHist: any = { ...e };
            if (!e.id) {
                delete empHist.id;
            }
            delete empHist.year;

            this.employeeProfile.employementHistory.push(empHist);
        });
    }

    prepareToSaveEducationHistory(): void {
        this.employeeProfile.educationHistory = [];
        this.dataProfileDetail.educationHistory.forEach(e => {
            const dts: any = e.year.split('-');

            const sdStr: any = dts[0].split('/');
            const sd: string = sdStr[1].trim() + '-' + sdStr[0].trim();
            if (!e.startDate.startsWith(sd)) {
                e.startDate = sd + '-01';
            }

            const edStr: any = dts[1].split('/');
            const ed: string = edStr[1].trim() + '-' + edStr[0].trim();
            if (!e.endDate.startsWith(ed)) {
                e.endDate = ed + '-01';
            }

            const eduHist: any = { ...e };
            if (!e.id) {
                delete eduHist.id;
            }
            delete eduHist.note;
            delete eduHist.year;

            this.employeeProfile.educationHistory.push(eduHist);
        });
    }

    prepareToSaveSubscription(): void {
        //this.employeeProfile.profileSubscription = {};
	/*let subscription: any = {
		subscription: {
			id: this.dataProfileDetail.subcriptionID
		}
	};*/
	//this.employeeProfile.profileSubscription = subscription;
    }

    removeNulls(): void {
        delete this.employeeProfile.industryId;
    }

    // change date nghi bug 5
	changeStartDate(index: number): any {
		if (index === 0) {
			for (let i: number = 1; i < 5; i++) {
				this.dataProfileDetail.workAbility[i].start = this.dataProfileDetail.workAbility[0].start;
			}
		}
	}
	changeEndDate(index: number): any {
		if (index === 0) {
			for (let i: number = 1; i < 5; i++) {
				this.dataProfileDetail.workAbility[i].end = this.dataProfileDetail.workAbility[0].end;
			}
		}
	}

    // add New Endorement Func
    addNewEndorementFunc(): void {
        let modalEndorsementsPage: any = this.modal.create('EndorsementsPage', {}, {
            showBackdrop: true,
            cssClass: 'modal-endorsements-profile',
			enterAnimation: 'modal-transition-enter',
			leaveAnimation: 'modal-transition-leave'
        });
		modalEndorsementsPage.present();
    }
    // edit subcription
    editSubscriptionFunc(): void {
        let editSubcription: any = this.modal.create('SelectSubscriptionAlert', {}, {
            cssClass: 'modal-select-scription',
			enterAnimation: 'modal-transition-enter',
            leaveAnimation: 'modal-transition-leave'
        });
        editSubcription.present();
        editSubcription.onDidDismiss((data: any) => {
            if (data) {
		this.employeeProfile.profileSubscription = {subscription: {}};
				this.dataProfileDetail.profileSubscription = {subscription: {}};
                //this.dataProfileDetail.subcription = data;
                //this.dataProfileDetail.subcriptionID = data.id;
		this.employeeProfile.profileSubscription.subscription.pricePerMonth = data.pricePerMonth;
		this.employeeProfile.profileSubscription.subscription.title = data.title;
		this.employeeProfile.profileSubscription.subscription.id = data.id;
            }
        });
    }

    // delete Photo
    deletePhoto(index: number): void {
        if (this.dataProfileDetail.images.length > 1) {
            this.dataProfileDetail.images.splice(index, 1);
        }
    }

    // add Photo
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
			let imageObj: any = {
            'image': 'assets/img/house03.jpg'
        };
        this.dataProfileDetail.images.push(imageObj);
		});

		profileModal.present();
	}

    // click body
	onClick(event: any): void {
        this.isEditDescInfo = false;
        this.isShowEditEmployment = false;
        this.isShowEditEmploymentClone = false;
    }

    editEmploymentFunc(event: any): void {
		event.stopPropagation();
		if (this.isShowEditEmployment) {
            this.errorNote = this.noteInput.hasError('required');
            this.errorTitle = this.titleInput.hasError('required');
            this.errorYear = this.yearInput.hasError('required');
			if (!this.errorNote) {
				this.isShowEditEmployment = ! this.isShowEditEmployment;
			}
		} else {
			this.isShowEditEmployment = ! this.isShowEditEmployment;
		}
    }

    editEmploymentCloneFunc(event: any): void {
		event.stopPropagation();
		if (this.isShowEditEmploymentClone) {
            this.errorNoteClone = this.noteInputClone.hasError('required');
            this.errorTitleClone = this.titleInputClone.hasError('required');
            this.errorYearClone = this.yearInputClone.hasError('required');
			if (!this.errorNote) {
				this.isShowEditEmploymentClone = ! this.isShowEditEmploymentClone;
			}
		} else {
			this.isShowEditEmploymentClone = ! this.isShowEditEmploymentClone;
		}
	}

    // remove error
	removeErrorFunc(event: any, type: string): void {
		event.stopPropagation();
		if (type === 'title') {
            this.errorTitle = false;
            this.errorTitleClone = false;
		}else if (type === 'note') {
            this.errorNote = false;
            this.errorNoteClone = false;
		}else{
            this.errorYear = false;
             this.errorYearClone = false;
		}
    }
    // remove error
	removeErrorCloneFunc(event: any, type: string): void {
		event.stopPropagation();
		if (type === 'titleClone') {
            this.errorTitleClone = false;
		}else if (type === 'noteClone') {
            this.errorNoteClone = false;
		}else{
             this.errorYearClone = false;
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
