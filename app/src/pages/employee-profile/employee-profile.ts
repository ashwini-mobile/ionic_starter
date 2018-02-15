import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, Content, Platform } from 'ionic-angular';
import { DatePipe } from '@angular/common';
import { DatePickerDirective } from 'datepicker-ionic2';
import * as _ from 'lodash';
import * as $ from 'jquery';
import { LookupProvider } from '../../providers/lookup-provider';
import { EmployeeProfile } from '../../models/employee-profile';
import { EmployeeProfileProvider } from '../../providers/employee-profile-provider';
import { UserProvider } from '../../providers/user-provider';
import { DataSvcProvider } from '../../providers/data-svc/data-svc';
import * as moment from 'moment';
import { LocationService } from '../../providers/location-service';

@IonicPage()
@Component({
	selector: 'page-employee-profile',
	templateUrl: 'employee-profile.html',
	providers: [DatePipe]
})
export class EmployeeProfilePage {

    private employeeProfile: EmployeeProfile = new EmployeeProfile();
    private currentStep: number = 0;
	private currentForm: any = null;
	private twoStepsBack: number = 0;
	private allowScroll: boolean = false;
    private enableEndorsePopUp: any = true;

    @ViewChild(DatePickerDirective) private datepickerDirective: DatePickerDirective;
	private today: Date = new Date();
	private dateSetStart: Date = new Date();
	private txtDateSetStart: string = '';
	private dateSetEnd: Date = new Date();
	private txtDateSetEnd: string = '';

	private dateSetStartStepEleven: Date = new Date();
	private txtDateSetStartStepEleven: string = '';
	private dateSetEndStepEleven: Date = new Date();
	private txtDateSetEndStepEleven: string = '';

	rootNavCtrl: any;
	public day: any = 'Day';

	public whatDo: any = [
		{
			name: 'Dental Assistant (DA,EFDA,RDA',
			checked: false
		},
		{
			name: 'Dental Front Office',
			checked: false
		},
		{
			name: 'Dental Office Manager',
			checked: false
		},
		{
			name: 'Dental Hygienist (RDH)',
			checked: false
		},
		{
			name: 'Dental Lab Tech',
			checked: false
		},
		{
			name: 'Dentist(DDS,DMD)',
			checked: false
		},
		{
			name: 'Dental Specific Services',
			checked: false
		}
	];

	public profileBuildStepsCopy: any = [
		{
			readyToOpen: true,
			open: true,
			complete: false,
			skip: false,
			data: {
				name: 'Some Personal Details',
				label: 'Date of Birth',
				text: 'Optional',
				day: '',
				month: '',
				year: '',
				city: '',
				state: '',
				zipcode: '',
                specializedIn: [],
                other: []
			}
		},
		{
			readyToOpen: true,
			open: false,
			complete: false,
			skip: false,
			data: {
				name: 'What do you do in the Dental World',
				specializedIn: [],
				other: ''
			}
		},
		{
			readyToOpen: false,
			open: false,
			complete: false,
			skip: false,
			data: {
				name: 'What is your Work Availability ?',
				workAbility: [
					{
						label: 'Monday',
						start: '',
						end: '',
						type: '',
					},
					{
						label: 'Tuesday',
						start: '',
						end: '',
						type: '',
					},
					{
						label: 'Wednesday',
						start: '',
						end: '',
						type: '',
					},
					{
						label: 'Thursday',
						start: '',
						end: '',
						type: '',
					},
					{
						label: 'Friday',
						start: '',
						end: '',
						type: '',
					},
					{
						label: 'Saturday',
						start: '',
						end: '',
						type: '',
					},
					{
						label: 'Sunday',
						start: '',
						end: '',
						type: '',
					}
				]
			}
		},
		{
			readyToOpen: false,
			open: false,
			complete: false,
			skip: false,
			data: {
				name: 'Image Upload Centre',
				desc: 'Pick the perfect profile pic and others that tell your offices story',
				photos: []
			}
		},
		{
			readyToOpen: false,
			open: false,
			complete: false,
			skip: false,
			data: {
				name: 'Which Dental Practice Management Software are you proficient at ?',
				specializedIn: [],
				other: []
			}
		},
		{
			readyToOpen: false,
			open: false,
			complete: false,
			skip: false,
			data: {
				name: 'Dental Technology Skills',
				specializedIn: [],
				other: []
			}
		},
		{
			readyToOpen: false,
			open: false,
			complete: false,
			skip: false,
			data: {
				name: 'What other Technologies/Software are you familiar with ?',
				specializedIn: [],
				other: []
			}
		},
		{
			readyToOpen: false,
			open: false,
			complete: false,
			skip: false,
			data: {
				name: 'General Skills',
				specializedIn: [],
				other: []
			}
		},
		{
			readyToOpen: false,
			open: false,
			complete: false,
			skip: false,
			data: {
				name: 'Administrative Skills',
				specializedIn: [],
				other: []
			}
		},
		{
			readyToOpen: false,
			open: false,
			complete: false,
			skip: false,
			data: {
				name: 'What Dental Philosophy/Training do you have ?',
				specializedIn: [],
				other: []
			}
		},
		{
			readyToOpen: false,
			open: false,
			complete: false,
			skip: false,
			data: {
				name: 'Employment History',
				businessName: '',
				title: '',
				workAbility: [
					{
						start: '',
						end: '',
					}
				]
			}
		},
		{
			readyToOpen: false,
			open: false,
			complete: false,
			skip: false,
			data: {
				name: 'Peer to Peer Endorsements',
				desc: 'It\'s important to have great endorsements. Invite people in your dental circles (past employers, coworkers, or anyone dental specific) to endorse you and your work?',
				firstName: '',
				lastName: '',
				email: '',
				isCanContact: false
			}
		},
		{
			readyToOpen: false,
			open: false,
			complete: false,
			skip: false,
			data: {
				name: 'Education History',
				school: '',
				degree: '',
				workAbility: [
					{
						start: '',
						end: '',
					}
				],
				activities: '',
				desc: '',
			}
		},
		{
			readyToOpen: false,
			open: false,
			complete: false,
			skip: false,
			data: {
				name: 'Where would you like to work ?',
				label: 'Current location',
				location: [],
			}
		},
		{
			readyToOpen: false,
			open: false,
			complete: false,
			skip: false,
			data: {
				name: 'Introduction/About Me',
				textarea: 'Please provide a brief description of who you are and what drives you in dentistry',
			}
		}
	];

	private arrayBusinessFilter: any = [];
	private arrayBusiness: any = [
		{
			'title': 'ET Medical Centre, NY'
		},
		{
			'title': 'ET Medical Centre, MA'
		},
		{
			'title': 'ET Medical Centre, FL'
		},
		{
			'title': 'ET Medical Centre, FL'
		}
	];

	public profileBuildSteps: Array<any>;
	public profiles: any = [];

	public allPhotosFill: boolean = false;

	public progress: number = 100 / 15;
	public firstAutoFillStartDay: boolean = false;
	public firstAutoFillEndDay: boolean = false;
	public firstAutoFillTypeDay: boolean = false;

	public hasBlankProfile: boolean = true;
	public isEmployerProfileRequired: boolean = false;

	public dobDay: string = '';
    public dobMonth: string = '';
    public dobYear: string = '';

	public errorDobDay: boolean = false;
	public errorDobMonth: boolean = false;
	public errorCity: boolean = false;
	public errorState: boolean = false;
	public errorZipCode: boolean = false;
	public errorLanguagesSpoken: boolean = false;

	public errorDentalWorldSpecializedIn: boolean = false;

	public errorWorkAvailability: boolean = false;

	public errorBusinessName: boolean = false;
    public errorJobTitle: boolean = false;
    public errorJobStartDate: boolean = false;
    public errorJobEndDate: boolean = false;

    public errorEndorseFirstName: boolean = false;
    public errorEndorseLastName: boolean = false;
    public errorEndorseContact: boolean = false;

    public errorSchoolName: boolean = false;
    public errorDegree: boolean = false;
    public errorDegreeStartDate: boolean = false;
    public errorDegreeEndDate: boolean = false;
    public errorDegreeActivities: boolean = false;
	public errorDegreeDesc: boolean = false;
	public isIphoneX: boolean = false;
	private listSchool: any[] = [];
	private listSchoolFilter: any[] = [];

    @ViewChild(Content) content: Content;


	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public modalCtrl: ModalController,
		public lookupProvider: LookupProvider,
        public employeeProfileProvider: EmployeeProfileProvider,
        public userProvider: UserProvider,
		private datePipe: DatePipe,
		private platform: Platform,
		private dataSvc: DataSvcProvider,
		private locationService: LocationService
	) {
		let that: any = this;
		this.locationService.getCurrentLocation();
		this.platform.ready().then((readySource) => {
			that.isIphoneX = that.platform.is('ios') && that.platform.height() === 812 && that.platform.width() === 375;
		});

		this.profileBuildSteps = _.cloneDeep(this.profileBuildStepsCopy );
		if (locationService.fullAddress) {
			this.profileBuildSteps[13].data.location.push({
				address: locationService.fullAddress
			});
		}

		this.rootNavCtrl = navParams.get('rootNavCtrl');
		const entryQuestion: any = this.navParams.get('entryQuestion');
		if (entryQuestion) {
			const answers: any[] = entryQuestion.answerOptions.filter(a => a.isActive).map(a => {
				delete a.isActive;
				return { ...a };
			});
			this.employeeProfile.profileQuestionAnswers.push({
				questionId: entryQuestion.questionId,
				selectedAnswerOptions: answers,
				otherAnswer: entryQuestion.otherAnswer ? [entryQuestion.otherAnswer] : []
			});
		}
		this.isEmployerProfileRequired = this.navParams.get('isEmployerProfileRequired');

		setTimeout(function(): void {
			that.dataSvc.loadSchool().then(res => {
				that.listSchool = res;
				that.listSchoolFilter = [];
			});
		}, 2000);
	}

	ionViewWillEnter(): void {
		this.locationService.getCurrentLocation();
	}

	searchAutoSchoolName(): void{
		this.listSchoolFilter = [];
		if (this.profileBuildSteps[12].data.school !== '') {
			for (let i: number = 0; i < this.listSchool.length; i++) {
				let school: any = this.listSchool[i];
				if (school.name.indexOf(this.profileBuildSteps[12].data.school) !== -1) {
					this.listSchoolFilter.push(school);
					if (this.listSchoolFilter.length >= 6) {
						return;
					}
				}
			}
		}
	}

	searchAutoBusinessName(): void{
		if (this.profileBuildSteps[10].data.businessName === '') {
				this.arrayBusinessFilter = [];
		} else{
				this.arrayBusinessFilter = Object.assign([], this.arrayBusiness).filter(
				item => this.compareString(item.title, this.profileBuildSteps[10].data.businessName));
		}
	}

	compareString(str1: string, str2: string): boolean {
			if (str1.toLowerCase().indexOf(str2.toLowerCase()) !== -1 || str1.toLowerCase().trim() === str2.toLowerCase().trim()){
					return true;
			}
			return false;
	}

	ionViewDidLoad(): void {
		let profileModal: any = this.modalCtrl.create('ProfileAlertPage', {
			title: 'Import your Profile',
			link: [
				{
					text: 'Facebook',
					class: 'fb'
				},
				{
					text: 'Google Plus',
					class: 'gPlus'
				},
				{
					text: 'LinkedIn',
					class: 'linkedin'
				}
			]
		});
		profileModal.present();

		this.content.ionScrollEnd.subscribe((data) => {
			// console.log(data);
		});

		this.loadQuestions();
        this.loadOccupations();

        this.userProvider.getCurrentUser().subscribe(response => {
                this.hasBlankProfile = response.types && response.types.length === 0;
            },
            error => {
                console.log('Error in retrieving current user info');
                console.log(JSON.stringify(error));
            });
	}

    loadQuestions(): void {
        this.lookupProvider.getQuestions('employeeProfile').then(data => {
            data.items.forEach(q => {
                const pbs: any = this.profileBuildSteps.filter(_pbs => _pbs.data.name === q.text || _pbs.data.name === q.title);
                if (pbs.length > 0) {
                    pbs[0].data.questionId = q.id,
					pbs[0].data.specializedIn = [];
					q.answerOptions.sort((left, right): number => {
						if (left.value < right.value) return -1;
						if (left.value > right.value) return 1;
						return 0;
					});
                    q.answerOptions.forEach(a => {
                        pbs[0].data.specializedIn.push({
                            id: a.id,
                            questionId: a.questionId,
                            name: a.value,
                            value: false,
                        });
                    });
                }
			});
        });
    }

    loadOccupations(): void {
        this.lookupProvider.getOccupations().then(data => {
            this.profileBuildSteps[1].data.specializedIn = data.items.map(item => {
                return {
                    id: item.id,
                    name: item.value,
                    value: false,
                };
            });
        });
    }

	toogleContactCheckBox(): void {
		this.profileBuildSteps[11].data.isCanContact = !this.profileBuildSteps[11].data.isCanContact;
	}

	// validate form
	setCurrentForm(form1: any, form12: any): void {
		switch (this.currentStep) {
			case 0:
				this.currentForm = form1;
				break;
			case 11:
				this.currentForm = form12;
				break;
			default:
				this.currentForm = null;
		}
	}

	// toogle language
	toogleItem(item: any, step: number): void {
		if (step > 0) {
			_.forEach(this.profileBuildSteps[step].data.specializedIn, (c) => {
				if (c.name !== item.name) {
					c.value = false;
				}
			});
            if (!item.value) {
                this.profileBuildSteps[step].data.other = '';
            }
		}
        item.value = !item.value;
	}

	uncheckItems(step: number): void {
        if (step > 0 && this.profileBuildSteps[step].data.other) {
            _.forEach(this.profileBuildSteps[step].data.specializedIn, (c) => { c.value = false; });
        }
	}

	// toogle Step
	toogleStep(step: any, isPreviousStepValid: boolean): void {
		if (isPreviousStepValid && (this.currentForm === null || (this.currentForm !== null && this.currentForm.valid)) && !this.profileBuildSteps[this.currentStep].skip) {

			// check if step prior to target step is complete. If not, do not allow to jump.
			if (this.arePreviousFormsValid(step)) {
				this.hideOthers(step);
				this.profileBuildSteps[step].skip = false;
				this.profileBuildSteps[step].open = !this.profileBuildSteps[step].open;
				if (this.profileBuildSteps.length > step + 1) {
					this.profileBuildSteps[step + 1].readyToOpen = true;
				}
				this.profileBuildSteps[this.currentStep].complete = true;
				this.progress > (100 / 15) * (step + 1) ? this.progress : this.progress = (100 / 15) * (step + 1);

				this.processInStep(step);
				this.populate(this.currentStep);
				this.twoStepsBack = this.currentStep;
				this.currentStep = step;
				this.allowScroll = true;
				this.currentForm = null;
			}
		}
		else if ((this.profileBuildSteps[this.currentStep].skip || this.profileBuildSteps[step].complete || step < this.currentStep)) {
			this.hideOthers(step);
			if (!this.profileBuildSteps[this.currentStep].skip) {
				this.profileBuildSteps[step].open = true;
			}
			this.profileBuildSteps[this.currentStep].complete = isPreviousStepValid;
			this.processInStep(step);
			this.twoStepsBack = this.currentStep;
			this.currentStep = step;
			this.allowScroll = true;
			this.currentForm = null;
		}
		else {
			this.profileBuildSteps[step].open = (step === this.currentStep ? !this.profileBuildSteps[step].open : false);
		}
	}

	processInStep(step: number): void {
		if (step === 11 && (this.profileBuildSteps[step].open) && this.enableEndorsePopUp) {
			this.showReputationPopUp();
			this.enableEndorsePopUp = false;
		}
		/*
		if ( step < 14) {
			this.profileBuildSteps[step + 1].readyToOpen = true;
		}
		if (step > 0) {
			this.profileBuildSteps[step - 1].complete = true;
		}
		*/
		if (step === 13) {
			if (this.profileBuildSteps[13].data.location.length === 0) {
				if (this.locationService.fullAddress) {
					this.profileBuildSteps[13].data.location.push({
						address: this.locationService.fullAddress
					});
				} else {
					let alertModal: any = this.modalCtrl.create('LocationAlertPage', {
						title: 'Location',
						text: 'You location setting was turned off. Please turn on location setting to get your current location!\t Turn on location by: App Settings -> App permissions -> Location.'
					}, {enableBackdropDismiss: false});
					// alertModal callback
					alertModal.onDidDismiss((data: any) => {
					});
					alertModal.present();
				}
			}
		}
	}

	showReputationPopUp(): void {
		let alertModal: any = this.modalCtrl.create('AlertPage', {
			title: 'Did you know ?',
			text: `Reputation management through reviews is the single greatest marketing tool for a dental practice. Endorsement serve that purpose on
					One Dental Match, along with your imported Google, Facebook and Yelp reviews`
		}, {enableBackdropDismiss: false});
		// alertModal callback
		alertModal.onDidDismiss((data: any) => {
		});
		alertModal.present();
	}

	// update scroll
	updateScrollPage(step: any, isPreviousStepValid: boolean, event: any): void {
		let that: any = this;
		if (isPreviousStepValid && (this.currentForm === null || (this.currentForm !== null && this.currentForm.valid)) && this.allowScroll) {
			if (this.arePreviousFormsValid(step)) {
				setTimeout(function (): void {
					let topSet: any = $(event.target).parent().parent().parent().parent().parent()[0].offsetTop - 20;
					if (that.isIphoneX) { topSet -= 20; }
					that.content.scrollTo(0, topSet, 500);
				}, 500);
				this.allowScroll = false;
			}
		}
	}

	// update scroll on skip
	updateScrollPageOnSkip(step: any, isPreviousStepValid: boolean, event: any): void {
		let that: any = this;
		if (isPreviousStepValid && (this.currentForm === null || (this.currentForm !== null && this.currentForm.valid)) && this.allowScroll) {
			if (this.arePreviousFormsValid(step)) {
				setTimeout(function (): void {
					let topSet: any = $(event.target).parent().parent().parent().parent().parent()[0].offsetTop + 50;
					if (that.isIphoneX) { topSet -= 20; }
					that.twoStepsBack = that.currentStep;
					that.currentStep = step;
					that.content.scrollTo(0, topSet, 500);
				}, 500);
				this.allowScroll = false;
			}
		}
	}

	arePreviousFormsValid(step: number): boolean {
		for (let i: number = 0; i < step; i++) {
			if (i !== this.currentStep && !this.profileBuildSteps[i].complete && !this.profileBuildSteps[i].skip) {
				return false;
			}
		}
		return true;
	}

    addEmployer(step: number): void {
        if (!this.isValid(step, true)) {
            return;
        }

        this.populateNewEmployer(step);

		let alertModal: any = this.modalCtrl.create('AlertPage', {
				title: 'Success',
				text: `Employment History Details have been successfully saved.Press OK to add another employer`
		}, {enableBackdropDismiss: false});
		// alertModal callback
		alertModal.onDidDismiss((data: any) => {
			this.profileBuildSteps[10].data.businessName = '';
			this.profileBuildSteps[10].data.title = '';
		});
		alertModal.present();
	}

	populateNewEmployer(step: number): void {
        const data: any = this.profileBuildSteps[step].data;
        if (data.title !== '' && this.txtDateSetStartStepEleven !== '' && this.txtDateSetEndStepEleven !== null) {
            this.employeeProfile.employementHistory.push({
                otherEmployer: data.businessName,
                jobTitle: data.title,
                startDate: this.txtDateSetStartStepEleven,
                endDate: this.txtDateSetEndStepEleven,
            });

            data.businessName = '';
            data.title = '';
            this.txtDateSetStartStepEleven = '';
            this.txtDateSetEndStepEleven = '';

            console.log(JSON.stringify(this.employeeProfile));
        }
	}

	// clear Peer
	clearEndorsement(item: any): void {
			let alertModal: any = this.modalCtrl.create('AlertPage', {
					title: 'Did you know ?',
					text: `eputation management through reviews is the single greatest marketing tool for a dental practice. Endorsement serve that purpose on
					One Dental Match, along with your imported Google, Facebook and Yelp reviews`
			}, {enableBackdropDismiss: false});
			// alertModal callback
			alertModal.onDidDismiss((data: any) => {
			});
			alertModal.present();
	}

	addEndorsement(step: number): void {
        if (!this.isValid(step, true)) {
            return;
        }

        this.populateNewEndorsement(step);

		let alertModal: any = this.modalCtrl.create('AlertPage', {
			title: 'Success',
			text: `Endorsement has been successfully saved.Press OK to add another endorsement`,
			noHeader: true
		}, {enableBackdropDismiss: false});
		// alertModal callback
		alertModal.onDidDismiss((data: any) => {
			this.profileBuildSteps[11].data.firstName = '';
			this.profileBuildSteps[11].data.lastName = '';
			this.profileBuildSteps[11].data.email = '';
			this.profileBuildSteps[11].data.isCanContact = false;
		});
		alertModal.present();
	}

	populateNewEndorsement(step: number): void {
        const data: any = this.profileBuildSteps[step].data;
        if (data.firstName !== '' && data.lastName !== '' && data.email !== '') {
            this.employeeProfile.endorsement.push({
                firstName: data.firstName,
                lastName: data.lastName,
                email: data.email,
		isCanContact: data.isCanContact
            });

            data.firstName = '';
            data.lastName = '';
            data.email = '';
	    data.isCanContact = false;

            console.log(JSON.stringify(this.employeeProfile));
        }
    }

	addSchool(step: number): void {
        if (!this.isValid(step, true)) {
            return;
        }

        this.populateNewSchool(step);

		/*
		let alertModal: any = this.modalCtrl.create('AlertPage', {
				title: 'Did you know ?',
				text: `eputation management through reviews is the single greatest marketing tool for a dental practice. Endorsement serve that purpose on
				One Dental Match, along with your imported Google, Facebook and Yelp reviews`
		}, {enableBackdropDismiss: false});
		// alertModal callback
		alertModal.onDidDismiss((data: any) => {
			this.profileBuildSteps[10].data.businessName = 'Business Name';
			this.profileBuildSteps[10].data.title = 'Job title';
		});
		alertModal.present();
		*/
	}

	populateNewSchool(step: number): void {
        const data: any = this.profileBuildSteps[step].data;
        if (data.school !== '' && data.degree !== '' && this.txtDateSetStart !== '' && this.txtDateSetEnd !== '' &&
            data.activities !== '' && data.desc !== '') {
            this.employeeProfile.educationHistory.push({
                name: data.school,
                degree: data.degree,
                startDate: this.txtDateSetStart,
                endDate: this.txtDateSetEnd,
                activitiesAndSocieties: data.activities,
                description: data.desc,
            });

            data.school = '';
            data.degree = '';
            this.txtDateSetStart = '';
            this.txtDateSetEnd = '';
            data.activities = '';
            data.desc = '';

            console.log(JSON.stringify(this.employeeProfile));
        }
    }

	// add Photo
	addPhoto(id: any): void {
		let profileModal: any = this.modalCtrl.create('ProfileAlertPage', {
			title: 'Import Photos',
			link: [
				/*
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
				*/
				{
						text: 'Facebook',
						class: 'fb'
				}
			]
		});

		// profileModal callback
		profileModal.onDidDismiss((data: any) => {
            this.selectPhoto(id);
		});

		profileModal.present();
	}

    selectPhoto(id: any): void {
        this.userProvider.getFacebookPhotos().then(data => {
            let imagePickerModal: any = this.modalCtrl.create('ImagePicker', { images: data }, {
                showBackdrop: false,
                enterAnimation: 'modal-transition-enter',
                leaveAnimation: 'modal-transition-leave'
            });
            imagePickerModal.onDidDismiss((selectedImages: any) => {

                if (selectedImages) {
                    const selectedPhotos: any = selectedImages.filter(i => i.isSelected);
                    let photos: any = this.profileBuildSteps[3].data.photos;
                    let i: number = id;

                    selectedPhotos.forEach(p => {
                        if (i === 0) {
                            photos[i + '-'] = { ...p };
                        } else if (i === 1 || i === 2 || i === 3) {
                            photos[i + '-'] = { ...p };
                        } else {
                            photos[i + '-'] = { ...p };
                        }
                        i += 1;
                    });

					this.allPhotosFill = !!(photos['0-'] && photos['1-'] && photos['2-'] && photos['3-'] && photos['4-'] && photos['5-']);
                }
            });
            imagePickerModal.present();
        });
    }

    // remove Photo
	removePhoto(id: any): void {
		let photos: any = this.profileBuildSteps[3].data.photos;
		delete photos[id + '-'];
		this.allPhotosFill = !!(photos['0-'] && photos['1-'] && photos['2-'] && photos['3-'] && photos['4-'] && photos['5-']);
	}

	// skip Form
	skipForm(step: any): void{
		let nextStep: number = step + 1;

		this.hideOthers(nextStep);
		this.profileBuildSteps[nextStep].open = !this.profileBuildSteps[nextStep].open;
		this.profileBuildSteps[nextStep + 1].readyToOpen = true;
		this.profileBuildSteps[this.currentStep].complete = true;
		this.progress > (100 / 15) * (nextStep + 1) ? this.progress : this.progress = (100 / 15) * (nextStep + 1);

		this.processInStep(nextStep);
		this.populate(this.currentStep);
		this.allowScroll = true;
		this.currentForm = null;
	}

	// getProgress
	getProgress(): any {
			return {width: `${this.progress}%`};
	}

	// hide others
	hideOthers(step: any): any{
			for (let i: number = 0; i < this.profileBuildSteps.length; i++){
					if (i !== step){
							this.profileBuildSteps[i].open = false;
					}
			}
	}

	changeDob(event: any): void {
        if (event.day) {
            this.dobDay = event.day;
		} else if (event.month) {
            this.dobMonth = event.month;
        } else if (event.year) {
            this.dobYear = event.year;
        }
	}

	// change date nghi bug 5
    changeStartDate(index: number): any {
        if (!this.firstAutoFillStartDay && index === 0) {
            for (let i: number = 1; i < 5; i++) {
                if (this.profileBuildSteps[2].data.workAbility[i].start === '') {
                    this.profileBuildSteps[2].data.workAbility[i].start = this.profileBuildSteps[2].data.workAbility[0].start;
				}
            }
            this.firstAutoFillStartDay = true;
        }
    }

    changeEndDate(index: number): any {
        if (!this.firstAutoFillEndDay && index === 0) {
            for (let i: number = 1; i < 5; i++) {
                if (this.profileBuildSteps[2].data.workAbility[i].end === '') {
                    this.profileBuildSteps[2].data.workAbility[i].end = this.profileBuildSteps[2].data.workAbility[0].end;
                }
            }
            this.firstAutoFillEndDay = true;
        }
    }

    changeTypeDate(index: number): any {
        if (!this.firstAutoFillTypeDay && index === 0) {
            for (let i: number = 1; i < 5; i++) {
                if (this.profileBuildSteps[2].data.workAbility[i].type === '') {
                    this.profileBuildSteps[2].data.workAbility[i].type = this.profileBuildSteps[2].data.workAbility[0].type;
                }
            }
            this.firstAutoFillTypeDay = true;
        }
	}

	languagesSpokenTouched: boolean = false;

	getLanguagesSpoken(): any {
		return this.profileBuildSteps[0].data.specializedIn.filter(item => item.value);
	}

	// isValid
	isValid(step: number, isAdd: boolean): any{
        if (step === 0){
			// let day: any = this.profileBuildSteps[step].data.day;
			// let month: any = this.profileBuildSteps[step].data.month;
			let city: any = this.profileBuildSteps[step].data.city;
			let state: any = this.profileBuildSteps[step].data.state;
			let zipCode: any = this.profileBuildSteps[step].data.zipcode;
			this.errorDobDay = this.dobDay === '';
			this.errorDobMonth = this.dobMonth === '';
			this.errorCity = city === '';
			this.errorState = state === '';
			this.errorZipCode = state === '' || isNaN(zipCode);

            let checkedCount: number = 0;
            for (let i: number = 0; i < this.profileBuildSteps[step].data.specializedIn.length; i++){
                if (this.profileBuildSteps[step].data.specializedIn[i].value) {
                    checkedCount++;
                }
			}

			this.errorLanguagesSpoken = checkedCount <= 0;

			return !this.errorLanguagesSpoken && !this.errorDobDay && !this.errorDobMonth && !this.errorCity && !this.errorState && !this.errorZipCode;
        }
		else if (step === 1){
			let checkedCount: number = 0;
			let specializedIn: any = this.profileBuildSteps[step].data.specializedIn;
			for (let i: number = 0; i < specializedIn.length; i++){
				if (specializedIn[i].value) {
					checkedCount++;
				}
			}

			this.errorDentalWorldSpecializedIn = checkedCount === 0 && this.profileBuildSteps[step].data.other === '';

			return !this.errorDentalWorldSpecializedIn;
		}
		else if (step === 2){
			this.errorWorkAvailability = this.profileBuildSteps[step].data.workAbility[0].start === '' || this.profileBuildSteps[step].data.workAbility[0].end === ''
                || this.profileBuildSteps[step].data.workAbility[0].type === '';

			return !this.errorWorkAvailability;
		}
		else if (step === 4){
			return this.profileBuildSteps[step].data.photos !== '';
		}
		else if (step === 5){
			let checkedCount: number = 0;
			let specializedIn: any = this.profileBuildSteps[step].data.specializedIn;
			for (let i: number = 0; i < specializedIn.length; i++){
				if (specializedIn[i].value){
					checkedCount++;
				}
			}
			if (checkedCount > 0){
				return true;
			} else {
				return this.profileBuildSteps[step].data.other !== '';
			}
		}
		else if (step === 10) {
            if (!isAdd && this.profileBuildSteps[step].complete &&
                this.profileBuildSteps[step].data.businessName === '' && this.profileBuildSteps[step].data.title === '' &&
                this.txtDateSetStartStepEleven === '' && this.txtDateSetEndStepEleven === '') {
                return true;
            }

            this.errorBusinessName = this.profileBuildSteps[step].data.businessName === '';
            this.errorJobTitle = this.profileBuildSteps[step].data.title === '';
            this.errorJobStartDate = this.txtDateSetStartStepEleven === '';
            this.errorJobEndDate = this.txtDateSetEndStepEleven === '';

            if (this.errorBusinessName && this.errorJobTitle && this.errorJobStartDate && this.errorJobEndDate) {
                return isAdd ? false : this.employeeProfile.employementHistory.length > 0;
			} else if (this.errorBusinessName || this.errorJobTitle || this.errorJobStartDate || this.errorJobEndDate) {
                return false;
            }
			return true;
		}
        else if (step === 11) {
            if (!isAdd && this.profileBuildSteps[step].complete &&
                this.profileBuildSteps[step].data.firstName === '' && this.profileBuildSteps[step].data.lastName === '' &&
                this.profileBuildSteps[step].data.email === '') {
                return true;
            }

            this.errorEndorseFirstName = this.profileBuildSteps[step].data.firstName === '';
            this.errorEndorseLastName = this.profileBuildSteps[step].data.lastName === '';
            this.errorEndorseContact = this.profileBuildSteps[step].data.email === '';

            if (this.errorEndorseFirstName && this.errorEndorseLastName && this.errorEndorseContact) {
                return isAdd ? false : this.employeeProfile.endorsement.length > 0;
            } else if (this.errorEndorseFirstName || this.errorEndorseLastName || this.errorEndorseContact) {
                return false;
            }
            return true;
        }
		else if (step === 12) {
            if (!isAdd && this.profileBuildSteps[step].complete &&
                this.profileBuildSteps[step].data.school === '' && this.profileBuildSteps[step].data.degree === '' &&
                this.txtDateSetStart === '' && this.txtDateSetEnd === '' &&
                this.profileBuildSteps[step].data.activities === '' && this.profileBuildSteps[step].data.desc === '') {
                return true;
            }

            this.errorSchoolName = this.profileBuildSteps[step].data.school === '';
            this.errorDegree = this.profileBuildSteps[step].data.degree === '';
            this.errorDegreeStartDate = this.txtDateSetStart === '';
            this.errorDegreeEndDate = this.txtDateSetEnd === '';
            this.errorDegreeActivities = this.profileBuildSteps[step].data.activities === '';
            this.errorDegreeDesc = this.profileBuildSteps[step].data.desc === '';

            if (this.errorSchoolName && this.errorDegree && this.errorDegreeStartDate && this.errorDegreeEndDate && this.errorDegreeActivities && this.errorDegreeDesc) {
                return isAdd ? false : this.employeeProfile.educationHistory.length > 0;
            } else if (this.errorSchoolName || this.errorDegree || this.errorDegreeStartDate || this.errorDegreeEndDate || this.errorDegreeActivities || this.errorDegreeDesc) {
                return false;
            }
            return true;
		}
		return true;
	}

	// add Another location
	addAnotherLocationFunc(): void {
		let that: any = this;
		let modalMap: any = this.modalCtrl.create('MapAlertPage', { addressItem: 'EmployeeProfilePage' }, {cssClass: 'modal-map-alert'});
        modalMap.onDidDismiss((data: any) => {
            if (data && data !== '') {
				that.profileBuildSteps[13].data.location.push({
					address: data.address,
					latitude: data.latitude,
					longitude: data.latitude
				});
            }
        });
		modalMap.present();
	}
	updateLocationFunc(addressItem: any): void {
		let modalMap: any = this.modalCtrl.create('MapAlertPage', { addressItem: addressItem }, {cssClass: 'modal-map-alert'});
        modalMap.onDidDismiss((data: any) => {
            if (data && data !== '') {
                addressItem.address = data.address;
                addressItem.latitude = data.latitude;
                addressItem.longitude = data.longitude;
            }
        });
		modalMap.present();
	}

	// submit function
	submitFunc(): void {
		if (this.profileBuildSteps[14].open) {
            this.populate(14);
			this.profiles.push(_.cloneDeep(this.profileBuildSteps));
			this.employeeProfile.photos.forEach(p => { delete p.isSelected; } );
			if ( this.profileBuildSteps[10].data.businessName.length > 0 ) {
				let emplyrDetails: any = {otherEmployer: this.profileBuildSteps[10].data.businessName,
							startDate: this.txtDateSetStartStepEleven,
							endDate: this.txtDateSetEndStepEleven
							};
				this.employeeProfile.employementHistory.push(emplyrDetails);
			}
			if ( this.profileBuildSteps[11].data.firstName.length > 0 ) {
				let endorsment: any = {firstName: this.profileBuildSteps[11].data.firstName,
							lastName: this.profileBuildSteps[11].data.lastName,
							email: this.profileBuildSteps[11].data.email,
							isCanContact: this.profileBuildSteps[11].data.isCanContact
							};
				this.employeeProfile.endorsement.push(endorsment);
			}
			if ( this.profileBuildSteps[12].data.school.length > 0 ) {
				let schoolDetail: any = {name: this.profileBuildSteps[11].data.school,
							  degree: this.profileBuildSteps[11].data.degree,
							  startDate: this.txtDateSetStart,
							  endDate: this.txtDateSetEnd,
							  activitiesAndSocieties: this.profileBuildSteps[11].data.activities,
							  description: this.profileBuildSteps[11].data.desc
							 };
				this.employeeProfile.educationHistory.push(schoolDetail);
			}
			this.formatDayTimeToMilitary();
			this.employeeProfileProvider.createEmployeeProfile(this.employeeProfile).subscribe(response => {
					if (this.hasBlankProfile && this.isEmployerProfileRequired) {
						this.navCtrl.pop();
					} else {
						this.navCtrl.setRoot('Dashboard', { roleUser: 'employee' });
					}
                },
                error => {
                    console.log(error);
                });
		}
	}

	formatDayTimeToMilitary(): void {
		this.employeeProfile.availability.mondayStart = this.getMilitaryTimeFormat(this.employeeProfile.availability.mondayStart);
                this.employeeProfile.availability.mondayEnd = this.getMilitaryTimeFormat(this.employeeProfile.availability.mondayEnd);
                this.employeeProfile.availability.tuesdayStart = this.getMilitaryTimeFormat(this.employeeProfile.availability.tuesdayStart);
                this.employeeProfile.availability.tuesdayEnd = this.getMilitaryTimeFormat(this.employeeProfile.availability.tuesdayEnd);
                this.employeeProfile.availability.wednesdayStart = this.getMilitaryTimeFormat(this.employeeProfile.availability.wednesdayStart);
                this.employeeProfile.availability.wednesdayEnd = this.getMilitaryTimeFormat(this.employeeProfile.availability.wednesdayEnd);
                this.employeeProfile.availability.thursdayStart = this.getMilitaryTimeFormat(this.employeeProfile.availability.thursdayStart);
                this.employeeProfile.availability.thursdayEnd = this.getMilitaryTimeFormat(this.employeeProfile.availability.thursdayEnd);
                this.employeeProfile.availability.fridayStart = this.getMilitaryTimeFormat(this.employeeProfile.availability.fridayStart);
                this.employeeProfile.availability.fridayEnd = this.getMilitaryTimeFormat(this.employeeProfile.availability.fridayEnd);
                this.employeeProfile.availability.saturdayStart = this.getMilitaryTimeFormat(this.employeeProfile.availability.saturdayStart) || '00:00';
                this.employeeProfile.availability.saturdayEnd = this.getMilitaryTimeFormat(this.employeeProfile.availability.saturdayEnd) || '00:00';
                this.employeeProfile.availability.sundayStart = this.getMilitaryTimeFormat(this.employeeProfile.availability.sundayStart) || '00:00';
                this.employeeProfile.availability.sundayEnd = this.getMilitaryTimeFormat(this.employeeProfile.availability.sundayEnd) || '00:00';
	}

	// call bacK date step 13
	setDateStart(event: any): void {
		this.txtDateSetStart = this.datePipe.transform(event, 'MM/dd/yyyy');
		this.dateSetStart = event;
		if (this.dateSetStart.getTime() > this.dateSetEnd.getTime()) {
			this.dateSetEnd = this.dateSetStart;
			this.txtDateSetEnd = this.datePipe.transform(this.dateSetEnd, 'MM/dd/yyyy');
		}
		this.errorDegreeStartDate = false;
	}

	// call bacK date step 13
	setDateEnd(event: any): void {
		this.txtDateSetEnd = this.datePipe.transform(event, 'MM/dd/yyyy');
		this.dateSetEnd = event;
        this.errorDegreeEndDate = false;
	}

	// call bacK date step 11
	setDateStartStepEleven(event: any): void {
		this.txtDateSetStartStepEleven = this.datePipe.transform(event, 'MM/dd/yyyy');
		this.dateSetStartStepEleven = event;
		if (this.dateSetStartStepEleven.getTime() > this.dateSetEndStepEleven.getTime()) {
			this.dateSetEndStepEleven = this.dateSetStartStepEleven;
			this.txtDateSetEndStepEleven = this.datePipe.transform(this.dateSetEndStepEleven, 'MM/dd/yyyy');
		}
        this.errorJobStartDate = false;
	}

	// call bacK date step 11
	setDateEndStepEleven(event: any): void {
		this.txtDateSetEndStepEleven = this.datePipe.transform(event, 'MM/dd/yyyy');
		this.dateSetEndStepEleven = event;
		this.errorJobEndDate = false;
	}

    // Populate fields to request object
    populate(step: number): void {
        const data: any = this.profileBuildSteps[step].data;
        switch (step) {
            case 0:
            	const dob: Date = new Date((parseInt(this.dobYear) || (new Date).getFullYear()), parseInt(this.dobMonth) - 1, parseInt(this.dobDay) + 1);
            	this.employeeProfile.dateOfBirth = dob;
                this.employeeProfile.employeeLocation = {
                	locality: data.city,
					postalCode: data.zipcode,
					state: data.state
                };
                this.populateAnswers(data);
                break;
            case 1:
                const filteredItems: any = data.specializedIn.filter(s => {
                    return s.value;
                });

                if (filteredItems.length > 0) {
                    this.employeeProfile.occupation = {
                    	id: filteredItems[0].id,
						value: filteredItems[0].name,
					};
				}

                if (this.employeeProfile.occupation === undefined && data.other !== '') {
                    this.employeeProfile.occupation = { value: data.other };
                }
                break;
            case 2:
                this.employeeProfile.availability.mondayStart = this.getSpecificTimeFormat(data.workAbility[0].start);
                this.employeeProfile.availability.mondayEnd = this.getSpecificTimeFormat(data.workAbility[0].end);
                this.employeeProfile.availability.mondayAvailabilityType = data.workAbility[0].type;
                this.employeeProfile.availability.tuesdayStart = this.getSpecificTimeFormat(data.workAbility[1].start);
                this.employeeProfile.availability.tuesdayEnd = this.getSpecificTimeFormat(data.workAbility[1].end);
                this.employeeProfile.availability.tuesdayAvailabilityType = data.workAbility[1].type;
                this.employeeProfile.availability.wednesdayStart = this.getSpecificTimeFormat(data.workAbility[2].start);
                this.employeeProfile.availability.wednesdayEnd = this.getSpecificTimeFormat(data.workAbility[2].end);
                this.employeeProfile.availability.wednesdayAvailabilityType = data.workAbility[2].type;
                this.employeeProfile.availability.thursdayStart = this.getSpecificTimeFormat(data.workAbility[3].start);
                this.employeeProfile.availability.thursdayEnd = this.getSpecificTimeFormat(data.workAbility[3].end);
                this.employeeProfile.availability.thursdayAvailabilityType = data.workAbility[3].type;
                this.employeeProfile.availability.fridayStart = this.getSpecificTimeFormat(data.workAbility[4].start);
                this.employeeProfile.availability.fridayEnd = this.getSpecificTimeFormat(data.workAbility[4].end);
                this.employeeProfile.availability.fridayAvailabilityType = data.workAbility[4].type;
                this.employeeProfile.availability.saturdayStart = this.getSpecificTimeFormat(data.workAbility[5].start) || '00:00';
                this.employeeProfile.availability.saturdayEnd = this.getSpecificTimeFormat(data.workAbility[5].end) || '00:00';
                this.employeeProfile.availability.saturdayAvailabilityType = data.workAbility[5].type || 'full';
                this.employeeProfile.availability.sundayStart = this.getSpecificTimeFormat(data.workAbility[6].start) || '00:00';
                this.employeeProfile.availability.sundayEnd = this.getSpecificTimeFormat(data.workAbility[6].end) || '00:00';
                this.employeeProfile.availability.sundayAvailabilityType = data.workAbility[6].type || 'full';
                break;
			case 3:		// Photos
                for (let i: number = 0; i < 10; i++) {
                    if (!data.photos[i + '-']) {
                        break;
                    }
                    this.employeeProfile.photos.push(data.photos[i + '-']);
                }
				break;
			case 4:
				// Question: Which Dental Practice Management Software are you proficient at ?
				this.populateAnswers(data);
                		break;
			case 5:
				// Question: Dental Technology Skills
				this.populateAnswers(data);
                		break;
			case 6:
				// Question: What other Technologies/Software are you familiar with ?
				this.populateAnswers(data);
                		break;
			case 7:
				// Question: General Skills
				this.populateAnswersGeneralSkills(data);
				break;
			case 8:
				// Question: Administrative Skills
				this.populateAnswers(data);
                		break;
			case 9:
				// Question: What Dental Philosophy/Training do you have ?
				this.populateAnswers(data);
                		break;
			case 10:
                if (this.isValid(step, false)) {
                    this.populateNewEmployer(10);
                }
				break;
            case 11:
                if (this.isValid(step, false)) {
                    this.populateNewEndorsement(11);
                }
                break;
            case 12:
                if (this.isValid(step, false)) {
                    this.populateNewSchool(12);
                }
                break;
			case 14:
				this.employeeProfile.aboutMe = data.textarea;
				break;
            default:
                break;
        }
        // console.log(JSON.stringify(this.employeeProfile));
    }

    getSpecificTimeFormat(data: string): string {
	if (data === '00:00' || data === '') {
		return '12.00 AM';
	}
	return moment(data, 'HH:mm').format('hh.mm A');
    }

    getMilitaryTimeFormat(data: string): string {
	return moment(data, 'hh.mm A').format('HH:mm');
    }

    populateAnswers(data: any): void {
        const answers: any[] = data.specializedIn.filter(a => a.value).map(a => {
            return {
                id: a.id,
                questionId: a.questionId,
                value: a.name,
            };
        });
        this.employeeProfile.profileQuestionAnswers.push({
            questionId: data.questionId,
            selectedAnswerOptions: answers,
            otherAnswer: data.other.length > 0 ? [data.other] : []
        });
    }

	addOtherGeneralSkills(): void {
		this.profileBuildSteps[7].data.specializedIn.push(
			{
				name: this.profileBuildSteps[7].data.other,
				value: true,
				isOtherGenSkill: true
			}
		);

		this.profileBuildSteps[7].data.other = '';
	}

	populateAnswersGeneralSkills(data: any): void {
		const answers: any[] = data.specializedIn.filter(a => a.value && !a.isOtherGenSkill).map(a => {
		    return {
		        id: a.id,
		        questionId: a.questionId,
		        value: a.name,
		    };
		});
			const otherGenSkill: any[] = data.specializedIn.filter(a => a.value && a.isOtherGenSkill).map(a => {
		    return a.name;
		});
		if (data.other.length > 0) {
			otherGenSkill.push(data.other);
		}
		this.employeeProfile.profileQuestionAnswers.push({
		    questionId: data.questionId,
		    selectedAnswerOptions: answers,
		    otherAnswer: otherGenSkill
		});
		}


}
