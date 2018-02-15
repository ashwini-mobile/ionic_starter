import { Component, ViewChild } from '@angular/core';
import { IonicPage, ModalController, NavController, NavParams, Content, Platform } from 'ionic-angular';
import * as _ from 'lodash';
import * as $ from 'jquery';
import { EmployerProfile } from '../../models/employer-profile';
import { LookupProvider } from '../../providers/lookup-provider';
import { EmployerProfileProvider } from '../../providers/employer-profile-provider';
import { UserProvider } from '../../providers/user-provider';
import * as moment from 'moment';
/**
 * Generated class for the EmployeeProfilePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-employer-profile',
    templateUrl: 'employer-profile.html',
})
export class EmployerProfilePage {

    employerProfile: EmployerProfile = new EmployerProfile();
    private enableEndorsePopUp: any = true;
	public isIphoneX: boolean = false;
    @ViewChild(Content) content: Content;
    public day: any = 'Day';
    public languages: any = [
        {
            name: 'American Sign Language',
            checked: false
        },
        {
            name: 'Arabic',
            checked: false
        },
        {
            name: 'English',
            checked: false
        },
        {
            name: 'Chinese (Cantonese)',
            checked: false
        },
        {
            name: 'Chinese (Mandarin)',
            checked: false
        },
        {
            name: 'French',
            checked: false
        },
        {
            name: 'French (Creole)',
            checked: false
        },
        {
            name: 'German',
            checked: false
        },
        {
            name: 'Italian',
            checked: false
        },
        {
            name: 'Russian',
            checked: false
        },
        {
            name: 'Spanish',
            checked: false
        },
        {
            name: 'Tagalog',
            checked: false
        },
        {
            name: 'Vietnamese',
            checked: false
        }
    ];
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
            // step 1
            readyToOpen: true,
            open: true,
            complete: false,
			skip: false,
            data: {
                name: 'Whats your Office named and where is it located?',
                businessName: '',
                address1: '',
                address2: '',
                city: '',
                postalcode: null,
                telephone: null,
                state: '',
            }
        },
        {
            // step 2
            readyToOpen: true,
            open: false,
            complete: false,
			skip: false,
            data: {
                name: 'Your office specializes in ?',
                specializedIn: [
                    {
                        name: 'Endodontics',
                        value: false,
			isOtherSpecialization: false
                    },
                    {
                        name: 'General Dentistry',
                        value: false,
			isOtherSpecialization: false
                    },
                    {
                        name: 'Oral and Maxillofacial Surgery',
                        value: false,
			isOtherSpecialization: false
                    },
                    {
                        name: 'Orthodontics',
                        value: false,
			isOtherSpecialization: false
                    },
                    {
                        name: 'Pediatric Dentistry',
                        value: false,
			isOtherSpecialization: false
                    },
                    {
                        name: 'Periodontics',
                        value: false,
			isOtherSpecialization: false
                    },
                    {
                        name: 'Prostodontics',
                        value: false,
			isOtherSpecialization: false
                    }
                ],
                other: ''
            }
        },
        {
            // step 3
            readyToOpen: false,
            open: false,
            complete: false,
			skip: false,
            data: {
                name: 'My office staffs these areas',
                specializedIn: [
                    {
                        name: 'Dental Assistant (DA, EFDA, RDA)',
                        value: false,
			isOtherArea: false
                    },
                    {
                        name: 'Dental Front Office',
                        value: false,
			isOtherArea: false
                    },
                    {
                        name: 'Dental Office Manager',
                        value: false,
			isOtherArea: false
                    },
                    {
                        name: 'Dental Hygienist (RDH)',
                        value: false,
			isOtherArea: false
                    },
                    {
                        name: 'Dental Lab Tech',
                        value: false,
			isOtherArea: false
                    },
                    {
                        name: 'Dentist (DDS, DMD)',
                        value: false,
			isOtherArea: false
                    }
                ],
                other: ''
            }
        },
        {
            // step 4
            readyToOpen: false,
            open: false,
            complete: false,
			skip: false,
            data: {
                name: 'Let’s get some contact info',
                website: '',
                email: '',
                officeNo: '',
				selectedPreferred: null,
				selectedAlternate: null,
                preffered: [
                    {
                        label: 'Email',
                        value: 'email'
                    },
                    {
                        label: 'Phone',
                        value: 'phone'
                    }
                ],
                alternate: [
                    {
						label: 'Email',
						value: 'email'
                    },
                    {
						label: 'Phone',
						value: 'phone'
                    }
                ],
            }
        },
        {
            // step 5
            readyToOpen: false,
            open: false,
            complete: false,
			skip: false,
            data: {
                name: 'When are you open for business ?',
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
            // step 6
            readyToOpen: false,
            open: false,
            complete: false,
			skip: false,
            data: {
                name: 'Assign Office Profile Administrators',
                desc: 'Here you can add someone to help you manage this Office Profile . Set their administrator permissions below',
                firstName: '',
                lastName: '',
                email: '',
                profileOptions: [
                    {
                        name: 'Edit Office Profile',
                        value: true
                    },
                    {
                        name: 'Add/Edit Benches',
                        value: true
                    },
                    {
                        name: 'Manage Interview Requests',
                        value: true
                    },
                    {
                        name: 'Manage Match Requests',
                        value: true
                    }
                ]
            }
        },
        {
            // step 7
            readyToOpen: false,
            open: false,
            complete: false,
			skip: false,
            data: {
                name: 'Peer to Peer Endorsements',
                category: [
                    {
                        name: 'General Endorsement',
                        desc: 'Lets invite your employees, ex-employees, and customers to endorse you.',
                        firstName: '',
                        lastName: '',
                        email: '',
                        buttonLabel: 'ADD ANOTHER PEER'
                    },
                    {
                        name: 'Professional Endorsement',
                        desc: 'It’s important for the other dentists/practices that you refer to and from to endorse your office as well',
                        firstName: '',
                        lastName: '',
                        email: '',
                        buttonLabel: 'ADD ANOTHER PEER'
                    }
                ]
            }
        },
        {
            // step 8
            readyToOpen: false,
            open: false,
            complete: false,
			skip: false,
            data: {
                name: 'Build your Employee Organization',
                organization: {
                    name: '',
                    branches: [
                        {
                            name: '',
                            sections: [
                                {
                                    groups: [
                                        {
                                            name: ''
                                        }
                                    ]
                                },
                                {
                                    groups: []
                                },
                                {
                                    groups: [
                                        {
                                            name: ''
                                        }
                                    ]
                                },
                            ]
                        }
                    ],
                }
            }
        },
        {
            // step 9
            readyToOpen: false,
            open: false,
            complete: false,
			skip: false,
            data: {
                name: 'Let’s tell everyone how wonderful your office culture is',
                desc: ''
            }
        },
        {
            // step 10
            readyToOpen: false,
            open: false,
            complete: false,
			skip: false,
            data: {
                name: 'Let’s add some photos',
                desc: 'Pick the perfect profile pic and others that tell your offices story',
                photos: []
            }
        },
        {
            // step 11
            readyToOpen: false,
            open: false,
            complete: false,
			skip: false,
            data: {
                name: 'Link your online reviews'
            }
        },
        {
            // step 12
            readyToOpen: false,
            open: false,
            complete: false,
			skip: false,
            data: {
                name: 'Add Another Office Profile'
            }
        }
    ];

    public profileBuildSteps: Array<any>;
    public profiles: any = [];

    public allPhotosFill: boolean = false;

    public progress: number = 100 / 12;
    public firstAutoFillStartDay: boolean = false;
    public firstAutoFillEndDay: boolean = false;
    public firstAutoFillTypeDay: boolean = false;

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

    private currentStep: number = 0;
    private currentForm: any = null;

	public errorPhone: boolean = false;
	public errorPostalCode: boolean = false;
    public errorOfcPhone: boolean = false;

    public errorStep1: boolean = false;

    public errorStep2: boolean = false;

    public errorStep3: boolean = false;

    public errorStep4: boolean = false;

    public errorStep5: boolean = false;

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public modalCtrl: ModalController,
                public lookupProvider: LookupProvider,
                public employerProfileProvider: EmployerProfileProvider,
                public userProvider: UserProvider,
                private platform: Platform
    ) {
		let that: any = this;
		this.platform.ready().then((readySource) => {
			that.isIphoneX = that.platform.is('ios') && that.platform.height() === 812 && that.platform.width() === 375;
		});
        this.profileBuildSteps = _.cloneDeep(this.profileBuildStepsCopy );

        const entryQuestion: any = this.navParams.get('entryQuestion');
        if (entryQuestion) {
            const answers: any[] = entryQuestion.answerOptions.filter(a => a.isActive).map(a => {
                delete a.isActive;
                return { ...a };
            });
            this.employerProfile.profileQuestionAnswers.push({
                questionId: entryQuestion.questionId,
                selectedAnswerOptions: answers,
                otherAnswer: entryQuestion.otherAnswer,
            });
        }
    }

    searchAutoBusinessName(): void{
        if (this.profileBuildSteps[0].data.businessName === '') {
            this.arrayBusinessFilter = [];
        } else{
            this.arrayBusinessFilter = Object.assign([], this.arrayBusiness).filter(
				    item => this.compareString(item.title, this.profileBuildSteps[0].data.businessName));
        }
    }

    compareString(str1: string, str2: string): boolean {
        if (str1.toLowerCase().indexOf(str2.toLowerCase()) !== -1 || str1.toLowerCase().trim() === str2.toLowerCase().trim()){
            return true;
        }
        return false;
    }

    ionViewDidLoad(): void {
        // Load static data in memory
        this.loadSpecializations();
        this.loadOccupations();
    }

    ionViewDidEnter(): void {
        let profileModal: any = this.modalCtrl.create('ProfileAlertPage', {
            title: 'Import your Business Profile',
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

        this.userProvider.getCurrentUser().subscribe(response => {
                if (response.types && response.types.length === 0) {
                    let alertModal: any = this.modalCtrl.create('AlertPage', {
                        text: 'Each Office profile must have an owner, so it\'s important to create a basic User profile first. ' +
                        'Skip the sections you want to as you can always complete your user profile at a later date'
                    }, {enableBackdropDismiss: false});

                    // alertModal callback
                    alertModal.onDidDismiss(() => {
                        const entryQuestion: any = this.navParams.get('entryQuestion');
                        this.navCtrl.push('EmployeeProfilePage', { title: 'EmployeeProfilePage', entryQuestion: entryQuestion, isEmployerProfileRequired: true });
                    });
                    alertModal.present();
                } else {
                    profileModal.present();
                }
            },
            error => {
                console.log('Error in retrieving current user info');
                console.log(JSON.stringify(error));
            });
    }

    loadSpecializations(): void {
        this.lookupProvider.getSpecializations().then(data => {
            this.profileBuildSteps[1].data.specializedIn = data.items.map(item => {
                return {
                    id: item.id,
                    name: item.value,
                    value: false,
                };
            });
        });
    }

    loadOccupations(): void {
        this.lookupProvider.getOccupations().then(data => {
            this.profileBuildSteps[2].data.specializedIn = data.items.map(item => {
                return {
                    id: item.id,
                    name: item.value,
                    value: false,
                };
            });
        });
    }

	// validate form
	setCurrentForm(form1: any, form4: any, form6: any, form7: any, form9: any): void {
    	switch (this.currentStep) {
			case 0:
				this.currentForm = form1;
				break;
			case 3:
				this.currentForm = form4;
				break;
			case 5:
				this.currentForm = this.isValid(this.currentStep) ? null : form6;
				break;
			case 6:
				this.currentForm = form7;
				break;
			case 8:
				this.currentForm = form9;
				break;
			default:
				this.currentForm = null;
		}
	}

	submittingOfficeStaff(): void {
		this.profileBuildSteps[2].data.specializedIn.push(
			{
				name: this.profileBuildSteps[2].data.other,
				value: true,
				isOtherArea: true
			}
		);

		this.profileBuildSteps[2].data.other = '';
	}

	submittingOtherSpecialization(): void {
		this.profileBuildSteps[1].data.specializedIn.push(
			{
				name: this.profileBuildSteps[1].data.other,
				value: true,
				isOtherSpecialization: true
			}
		);

		this.profileBuildSteps[1].data.other = '';
	}

    // toogle language
    toogleItem(item: any): void {
        item.value = !item.value;
    }

    // toogle Step
    toogleStep(step: any, isPreviousStepValid: boolean): void {
    	// console.log('step = ' + step + ', isPreviousStepValid = ' + isPreviousStepValid);
		// console.log('readyToOpen = ' + this.profileBuildSteps[step].readyToOpen + ', complete = ' + this.profileBuildSteps[step].complete);
		// console.log('skip = ' + this.profileBuildSteps[this.currentStep].skip);
        if (isPreviousStepValid && (this.currentForm === null || (this.currentForm !== null && this.currentForm.valid)) && !this.profileBuildSteps[this.currentStep].skip) {
			// check if step prior to target step is complete. If not, do not allow to jump.
			if (this.arePreviousFormsValid(step)) {
				this.hideOthers(step);
				this.profileBuildSteps[step].skip = false;
				this.profileBuildSteps[step].open = !this.profileBuildSteps[step].open;
				this.profileBuildSteps[step + 1].readyToOpen = true;
				this.profileBuildSteps[this.currentStep].complete = true;
				this.progress > (100 / 12) * (step + 1) ? this.progress : this.progress = (100 / 12) * (step + 1);

				this.processInStep(step);
				this.populate(this.currentStep);
				this.currentStep = step;
			}
        }
        else if (this.profileBuildSteps[this.currentStep].skip || this.profileBuildSteps[step].complete || step < this.currentStep) {
			this.hideOthers(step);
			this.profileBuildSteps[step].open = true;
			this.profileBuildSteps[this.currentStep].complete = isPreviousStepValid;
			this.processInStep(step);
			this.currentStep = step;
		}
        else {
            this.profileBuildSteps[step].open = (step === this.currentStep ? !this.profileBuildSteps[step].open : false);
        }
    }

	processInStep(step: number): void {
		if (step === 6 && (this.profileBuildSteps[step].open) && this.enableEndorsePopUp) {
			this.showReputationPopUp();
			this.enableEndorsePopUp = false;
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
		if (isPreviousStepValid && (this.currentForm === null || (this.currentForm !== null && this.currentForm.valid))) {
			if (this.arePreviousFormsValid(step)) {
				setTimeout(function (): void {
                    let topSet: any = $(event.target).parent().parent().parent().parent().parent()[0].offsetTop - 20;
					if (that.isIphoneX) { topSet -= 20; }
					that.content.scrollTo(0, topSet, 500);
				}, 500);
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

    // add Another Manager
    addAnotherManager(id: any, form: any): void {
    	if (!form.valid) {
    		return;
		}

		let checkedCount: number = 0;
		let profileOptions: any = this.profileBuildSteps[id].data.profileOptions;
		for (let i: number = 0; i < profileOptions.length; i++){
			if (profileOptions[i].value){
				checkedCount++;
			}
		}
		if (checkedCount === 0) {
			return;
		}

		const data: any = this.profileBuildSteps[id].data;
        this.employerProfile.officeManagers.push({
            firstName: data.firstName,
            lastName: data.lastName,
            email: data.email,
            permissions: data.profileOptions.filter(po => {
                    return po.value;
                }).map(po => {
                    return { value: po.name };
                }),
        });
        this.profileBuildSteps[id].data = {
            name: 'Assign Office Profile Administrators',
            desc: 'Here you can add someone to help you manage this Office Profile . Set their administrator permissions below',
            firstName: '',
            lastName: '',
            email: '',
            profileOptions: [
                {
                    name: 'Edit Office Profile',
                    value: true
                },
                {
                    name: 'Add/Edit Benches',
                    value: true
                },
                {
                    name: 'Manage Interview Requests',
                    value: true
                },
                {
                    name: 'Manage Match Requests',
                    value: true
                }
            ]
        };
    }

    // clear Peer
    clearPeer(item: any): void {
        item.firstName = '';
        item.lastName = '';
        item.email = '';

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

    // add Branch Before
    addBranchBefore(organization: any): void {
        let branch: any = {
            name: '',
            sections: [
                {
                    groups: [
                        {
                            name: ''
                        }
                    ]
                },
                {
                    groups: []
                },
                {
                    groups: [
                        {
                            name: ''
                        }
                    ]
                },
            ]
        };
        organization.branches.splice(0, 0, branch);
    }

    // add Branch after
    addBranchafter(organization: any): void {
        let branch: any = {
            name: '',
            sections: [
                {
                    groups: [
                        {
                            name: ''
                        }
                    ]
                },
                {
                    groups: []
                },
                {
                    groups: [
                        {
                            name: ''
                        }
                    ]
                },
            ]
        };
        organization.branches.push(branch);
    }

    // add Group
    addGroup(branch: any): void {
        branch.groups.push({name: ''});
    }

    // show Organization Popup
    showOrganizationPopup(): void {
        let alertModal: any = this.modalCtrl.create('AlertPage', {
            noHeader: true,
            image: 'assets/img/chart.png',
            title: 'SAMPLE OFFICE',
            text: `Using this tool you can configure how the office is organized. You can use this to illustrate
                    existing employees as well as open positions`,
            buttonText: 'GOT IT',
        }, {enableBackdropDismiss: false});
        // alertModal callback
        alertModal.onDidDismiss((data: any) => {
        });
        alertModal.present();
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
                    let photos: any = this.profileBuildSteps[9].data.photos;
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
        let photos: any = this.profileBuildSteps[9].data.photos;
        delete photos[id + '-'];
        this.allPhotosFill = !!(photos['0-'] && photos['1-'] && photos['2-'] && photos['3-'] && photos['4-'] && photos['5-']);
    }

    // show Link Popup
    showLinkPopup(): void{

        let profileModal: any = this.modalCtrl.create('ProfileAlertPage', {
            title: 'Select Account',
            link: [
                {
                    text: 'Google Review',
                    class: 'gPlus'
                },
                {
                    text: 'Yelp Review',
                    class: 'yelp'
                },
                {
                    text: 'Facebook Reveiw',
                    class: 'fb'
                }
            ]
        });

        // profileModal callback
        profileModal.onDidDismiss((data: any) => {
        });

        profileModal.present();
    }

    resetProfileBuildStepsToFirstState(): void {
        let stepID: number = 0;
        // step 1
        this.profileBuildSteps[stepID].readyToOpen = true;
        this.profileBuildSteps[stepID].open = true;
        this.profileBuildSteps[stepID].complete = false;
        this.profileBuildSteps[stepID].skip = false;
        stepID += 1;
        // step 2
        this.profileBuildSteps[stepID].readyToOpen = true;
        this.profileBuildSteps[stepID].open = false;
        this.profileBuildSteps[stepID].complete = false;
        this.profileBuildSteps[stepID].skip = false;
        stepID += 1;
        // step 3
        for (; stepID < 12; stepID++) {
            this.profileBuildSteps[stepID].readyToOpen = false;
            this.profileBuildSteps[stepID].open = false;
            this.profileBuildSteps[stepID].complete = false;
            this.profileBuildSteps[stepID].skip = false;
        }
    }

    // complete Steps
    completeSteps(): void{
        if ( this.profileBuildSteps[11].readyToOpen){
	    this.progress = 100;
	    this.addLatestOfficeDetails();
            let stepCompleteModal: any = this.modalCtrl.create('StepCompletePage');
            // profileModal callback
            stepCompleteModal.onDidDismiss((data: any) => {
            	if (data === null || data === undefined) {
            		return;
                }

                const initialUIState: any = {
                    firstAutoFillStartDay: false,
                    firstAutoFillEndDay: false,
                    firstAutoFillTypeDay: false,
                };
                this.formatDayTimeToMilitary();
                if (data.type === 'start'){
                    this.profiles.push(_.cloneDeep(this.profileBuildSteps));
                    this.profileBuildSteps = _.cloneDeep(this.profileBuildStepsCopy);
                    this.currentStep = 0;
                    this.progress = 100 / 12;
                    _.assign(this, initialUIState);
                } else if (data.type === 'copy'){
                    this.profiles.push(_.cloneDeep(this.profileBuildSteps));
                    this.resetProfileBuildStepsToFirstState();
                    this.profileBuildSteps = _.cloneDeep(this.profileBuildSteps);
                    this.currentStep = 0;
                    this.progress = 100 / 12;
                    _.assign(this, initialUIState);
					this.content.scrollTo(0, 0, 500);
                } else if (data.type === 'later'){
                    this.profiles.push(_.cloneDeep(this.profileBuildSteps));
                    this.employerProfile.photos.forEach(p => { delete p.isSelected; } );
                    this.employerProfileProvider.createEmployerProfile(this.employerProfile).subscribe(response => {
                            console.log('RESPONSE');
                            console.log(response);
                            this.navCtrl.setRoot('Dashboard', { roleUser: 'employer' });
                        },
                        error => {
                            console.log(error);
                            // let invalidPassword: boolean = (error.message === 'the username does not match the password.');
                            // let userNotVerified: boolean = error.message === 'An attempt was made to perform an operation that is not permitted: this email is not verified.';
                            // this.errorEmail = Utilities.checkErrorField(error, 'email') || invalidPassword || userNotVerified;
                            // this.errorPassWord = invalidPassword;
                        });
                }
            });

            stepCompleteModal.present();
        }
    }

    // skip Form
    skipForm(id: any): void{
        this.profileBuildSteps[id].complete = true;
		this.profileBuildSteps[id].skip = true;
		this.currentStep = id;
        this.toogleStep(id + 1, true);
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

    // change date nghi bug 5
    changeStartDate(index: number): any {
        if (!this.firstAutoFillStartDay && index === 0) {
            for (let i: number = 1; i < 5; i++) {
                if (this.profileBuildSteps[4].data.workAbility[i].start === '') {
                    this.profileBuildSteps[4].data.workAbility[i].start = this.profileBuildSteps[4].data.workAbility[0].start;
                }
            }
            this.firstAutoFillStartDay = true;
        }
    }

    changeEndDate(index: number): any {
        if (!this.firstAutoFillEndDay && index === 0) {
            for (let i: number = 1; i < 5; i++) {
                if (this.profileBuildSteps[4].data.workAbility[i].end === '') {
                    this.profileBuildSteps[4].data.workAbility[i].end = this.profileBuildSteps[4].data.workAbility[0].end;
                }
            }
            this.firstAutoFillEndDay = true;
        }
    }

    changeTypeDate(index: number): any {
        if (!this.firstAutoFillTypeDay && index === 0) {
            for (let i: number = 1; i < 5; i++) {
                if (this.profileBuildSteps[4].data.workAbility[i].type === '') {
                    this.profileBuildSteps[4].data.workAbility[i].type = this.profileBuildSteps[4].data.workAbility[0].type;
                }
            }
            this.firstAutoFillTypeDay = true;
        }
    }

    officeSpecializedInTouched: boolean = false;

    // isValid
    isValid(step: number): any {
    	if (step === 0) {
    		let phone: any = this.profileBuildSteps[step].data.telephone;
			let postalCode: any = this.profileBuildSteps[step].data.postalcode;
			this.errorPhone = isNaN(phone);
			this.errorPostalCode = isNaN(postalCode);
			return this.profileBuildSteps[step].data.businessName !== '' && this.profileBuildSteps[step].data.address1 !== '' &&
				(phone !== '' && !this.errorPhone) && this.profileBuildSteps[step].data.city !== '' &&
				this.profileBuildSteps[step].data.state !== '' && (postalCode !== '' && !this.errorPostalCode);
		}
        if (step === 1){
            let checkedCount: number = 0;
            let specializedIn: any = this.profileBuildSteps[step].data.specializedIn;
            for (let i: number = 0; i < specializedIn.length; i++){
                if (specializedIn[i].value){
                    checkedCount++;
                }
            }
            if (checkedCount > 0){
                this.errorStep2 = false;
                return true;
            } else {
                this.errorStep2 = this.profileBuildSteps[step].data.other === '';
                return !this.errorStep2;
            }
        }
        if (step === 2){
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
		if (step === 3) {
			let phone: any = this.profileBuildSteps[step].data.officeNo;
			this.errorOfcPhone = isNaN(phone);
			return this.profileBuildSteps[step].data.website !== '' && this.profileBuildSteps[step].data.email !== '' &&
                (phone !== '' && !this.errorOfcPhone) && this.profileBuildSteps[step].data.selectedPreferred !== null &&
                this.profileBuildSteps[step].data.selectedAlternate !== null;
		}
        if (step === 4){
            return this.profileBuildSteps[step].data.workAbility[0].start !== '' && this.profileBuildSteps[step].data.workAbility[0].end !== '';
        }
        if (step === 5) {
			return this.employerProfile.officeManagers.length > 0;
        }
        if (step === 7) {
            console.log(this.profileBuildSteps[step].data.organization.name);
            return this.profileBuildSteps[step].data.organization.name !== '';
        }
		return true;
    }

	addAnotherOffice(): void {
		const data: any = this.profileBuildSteps[0].data;
		if (data.businessName !== '' && data.address1 !== '' && data.city !== '') {
			this.employerProfile.offices.push({
				businessName: data.businessName,
				businessPhone: data.telephone,
				address: {
					street: `${data.address1}${data.address2 ? ', ' : ''}${data.address2}`,
					locality: {
						locality: data.city,
						postalCode: data.postalcode.toString(),
						state: data.state
					}
				}
			});

			data.businessName = '';
			data.telephone = null;
			data.address1 = '';
			data.address2 = '';
			data.city = '';
			data.postalcode = null;
			data.state = '';
		}

	}

	addLatestOfficeDetails(): void {
		const data: any = this.profileBuildSteps[0].data;
		this.employerProfile.offices.push({
				businessName: data.businessName,
				businessPhone: data.telephone,
				address: {
					street: `${data.address1}${data.address2 ? ', ' : ''}${data.address2}`,
					locality: {
						locality: data.city,
						postalCode: data.postalcode.toString(),
						state: data.state
					}
				}
			});
	}

    // Populate fields to request object
    populate(step: number): void {
        const data: any = this.profileBuildSteps[step].data;
        switch (step) {
            case 0:
                this.employerProfile.businessName = data.businessName;
                break;
            case 1:
                this.employerProfile.specializations = data.specializedIn.filter(s => {
                    return s.value && !s.isOtherSpecialization;
                }).map(s => {
                    return { id: s.id, value: s.name };
                });
                this.employerProfile.otherSpecialization = data.specializedIn.filter(s => {
			return s.value && s.isOtherSpecialization;
		}).map(s => {
			return { id: s.id, value: s.name };
		});
                break;
            case 2:
                this.employerProfile.areasToStaff = data.specializedIn.filter(s => {
                    return s.value && !s.isOtherArea;
                }).map(s => {
                    return { id: s.id, value: s.name };
                });

				this.employerProfile.otherAreasToStaff = data.specializedIn.filter(s => {
					return s.value && s.isOtherArea;
				}).map(s => {
					return { id: s.id, value: s.name };
				});

                break;
            case 3:
                this.employerProfile.website = data.website;
                this.employerProfile.contactEmail = data.email;
                this.employerProfile.contactPhone = data.officeNo;
				this.employerProfile.preferredContactOption = data.selectedPreferred;
				this.employerProfile.alternateContactOption = data.selectedAlternate;
                break;
            case 4:
                this.employerProfile.schedule.mondayStart = this.getSpecificTimeFormat(data.workAbility[0].start);
                this.employerProfile.schedule.mondayEnd = this.getSpecificTimeFormat(data.workAbility[0].end);
                this.employerProfile.schedule.tuesdayStart = this.getSpecificTimeFormat(data.workAbility[1].start);
                this.employerProfile.schedule.tuesdayEnd = this.getSpecificTimeFormat(data.workAbility[1].end);
                this.employerProfile.schedule.wednesdayStart = this.getSpecificTimeFormat(data.workAbility[2].start);
                this.employerProfile.schedule.wednesdayEnd = this.getSpecificTimeFormat(data.workAbility[2].end);
                this.employerProfile.schedule.thursdayStart = this.getSpecificTimeFormat(data.workAbility[3].start);
                this.employerProfile.schedule.thursdayEnd = this.getSpecificTimeFormat(data.workAbility[3].end);
                this.employerProfile.schedule.fridayStart = this.getSpecificTimeFormat(data.workAbility[4].start);
                this.employerProfile.schedule.fridayEnd = this.getSpecificTimeFormat(data.workAbility[4].end);
                this.employerProfile.schedule.saturdayStart = this.getSpecificTimeFormat(data.workAbility[5].start) || '00:00';
                this.employerProfile.schedule.saturdayEnd = this.getSpecificTimeFormat(data.workAbility[5].end) || '00:00';
                this.employerProfile.schedule.sundayStart = this.getSpecificTimeFormat(data.workAbility[6].start) || '00:00';
                this.employerProfile.schedule.sundayEnd = this.getSpecificTimeFormat(data.workAbility[6].end) || '00:00';
                break;
            case 5:
                // via addAnotherManager
                break;
            case 6:
                break;
            case 7:
                this.employerProfile.employeeOrganization.root.title = data.organization.name;
                data.organization.branches.forEach(b => {
                    const childBranch: any = {
                        title: b.name,
                        children: [],
                    };
                    b.sections.forEach(s => {
                        const childSection: any = {
                            children: [],
                        };
                        s.groups.forEach((g, idx) => {
                            if (idx === 0) {
                                childSection.title = g.name;
                            } else {
                                childSection.children.push({ title: g.name });
                            }
                        });
                        childBranch.children.push(childSection);
                    });
                    this.employerProfile.employeeOrganization.root.children.push(childBranch);
                });

                // console.log(this.employerProfile.employeeOrganization);
                break;
            case 8:
                this.employerProfile.officeCultureDescription = data.desc;
                break;
            case 9:
                for (let i: number = 0; i < 10; i++) {
                    if (!data.photos[i + '-']) {
                        break;
                    }
                    this.employerProfile.photos.push(data.photos[i + '-']);
                }
                break;
            default:
                break;
        }
        console.log(JSON.stringify(this.employerProfile));
    }

	getSpecificTimeFormat(data: string): string {
	console.log(data);
	if (data === '00:00' || data === '') {
		return '12.00 AM';
	}
	return moment(data, 'HH:mm').format('hh.mm A');
    	}

        formatDayTimeToMilitary(): void {
		this.employerProfile.schedule.mondayStart = this.getMilitaryTimeFormat(this.employerProfile.schedule.mondayStart);
                this.employerProfile.schedule.mondayEnd = this.getMilitaryTimeFormat(this.employerProfile.schedule.mondayEnd);
                this.employerProfile.schedule.tuesdayStart = this.getMilitaryTimeFormat(this.employerProfile.schedule.tuesdayStart);
                this.employerProfile.schedule.tuesdayEnd = this.getMilitaryTimeFormat(this.employerProfile.schedule.tuesdayEnd);
                this.employerProfile.schedule.wednesdayStart = this.getMilitaryTimeFormat(this.employerProfile.schedule.wednesdayStart);
                this.employerProfile.schedule.wednesdayEnd = this.getMilitaryTimeFormat(this.employerProfile.schedule.wednesdayEnd);
                this.employerProfile.schedule.thursdayStart = this.getMilitaryTimeFormat(this.employerProfile.schedule.thursdayStart);
                this.employerProfile.schedule.thursdayEnd = this.getMilitaryTimeFormat(this.employerProfile.schedule.thursdayEnd);
                this.employerProfile.schedule.fridayStart = this.getMilitaryTimeFormat(this.employerProfile.schedule.fridayStart);
                this.employerProfile.schedule.fridayEnd = this.getMilitaryTimeFormat(this.employerProfile.schedule.fridayEnd);
                this.employerProfile.schedule.saturdayStart = this.getMilitaryTimeFormat(this.employerProfile.schedule.saturdayStart) || '00:00';
                this.employerProfile.schedule.saturdayEnd = this.getMilitaryTimeFormat(this.employerProfile.schedule.saturdayEnd) || '00:00';
                this.employerProfile.schedule.sundayStart = this.getMilitaryTimeFormat(this.employerProfile.schedule.sundayStart) || '00:00';
                this.employerProfile.schedule.sundayEnd = this.getMilitaryTimeFormat(this.employerProfile.schedule.sundayEnd) || '00:00';
	}

       getMilitaryTimeFormat(data: string): string {
	return moment(data, 'hh.mm A').format('HH:mm');
    }

}
