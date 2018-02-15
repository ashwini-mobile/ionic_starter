import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ModalController, ActionSheetController} from 'ionic-angular';
import { DataSvcProvider } from '../../providers/data-svc/data-svc';
import { EmployeeProfileProvider } from '../../providers/employee-profile-provider';
import { EmployeeProfile } from '../../models/employee-profile';
import { DatePipe } from '@angular/common';
import { LookupProvider } from '../../providers/lookup-provider';

/**
 * Generated class for the ProfileAlertPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-detail-profile-employee',
    templateUrl: 'detail-profile-employee.html',
    providers: [DatePipe]
})
export class DetailProfileEmployeePage {
    private dataProfileDetail: any;
    private isSubcription: boolean = false;
    private isShowViewMoreFriend: boolean = false;

    private employeeProfile: any = new EmployeeProfile();
    private questions: any = [];

    private questionSoftSkill: string = 'Which Dental Practice Management Software are you proficient at ?';
    private questionTechSkill: string = 'Dental Technology Skills';
    private questionOtherSoft: string = 'What other Technologies/Software are you familiar with ?';
    private questionGeneralSkill: string = 'General Skills';
    private questionAdminSkill: string = 'Administrative Skills';
    private questionDentalPhil: string = 'What Dental Philosophy/Training do you have ?';

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public viewCtrl: ViewController,
        private employeeProfileProvider: EmployeeProfileProvider,
        private lookupProvider: LookupProvider,
        private svcService: DataSvcProvider,
        private modal: ModalController,
		public actionSheetCtrl: ActionSheetController,
    	private datePipe: DatePipe,
    ) {

        this.svcService.loadProfileDetailEmployee().then(res => {
            this.dataProfileDetail = res;

            const userId: number = this.navParams.data.userId || this.navParams.data.employee.id;
            this.dataProfileDetail.name = this.navParams.data.employee.username || this.navParams.data.employee.name;
            if (this.dataProfileDetail.name === null || this.dataProfileDetail.name === undefined) {
                this.dataProfileDetail.name = this.navParams.data.employee.local.username || this.navParams.data.employee.local.name;
            }
            this.employeeProfileProvider.getEmployeeProfileByUserId(userId)
                .subscribe(response => {
                        this.employeeProfile = response;
                        this.populatedEmploymentHistory();
                        this.populatedEducationHistory();
                        this.loadQuestions();
                    },
                    error => {
                        console.log('Error in retrieving employee profile');
                        console.log(error);
                    });


        });

        this.svcService.getSubcriptionVariable().then(res => {
            this.isSubcription = res;
        });

    }

    ionViewDidLoad(): void {
        console.log('ionViewDidLoad OfficesAlertPage');
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

    // dismiss
    dismiss(): void {
        this.viewCtrl.dismiss();
    }

    showModalShareFunc(): void {
		// let modalShareProfile: any = this.modal.create('ShareAlert', {}, { showBackdrop: true, cssClass: 'modal-share-profile' });
        // modalShareProfile.present();
        let actionSheet: any = this.actionSheetCtrl.create({
			title: 'Tap to Share',
			buttons: [
				{
					text: 'Destructive',
					role: 'destructive',
					handler: () => {
						console.log('Destructive clicked');
					}
				},
				{
					text: 'Archive',
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
}
