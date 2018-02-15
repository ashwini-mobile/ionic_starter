import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, ViewController, NavParams, ModalController} from 'ionic-angular';
import { Friend } from '../../providers/data-svc/friend';
import { UserProvider } from '../../providers/user-provider';
import { EmployerProfileProvider } from '../../providers/employer-profile-provider';
import { EmployeeProfileProvider } from '../../providers/employee-profile-provider';
import { CallNumber } from '@ionic-native/call-number';
@IonicPage()
@Component({
	selector: 'page-benches-matches',
	templateUrl: 'benches-matches.html'
})
export class BenchesMatchesPage {
	private heightIndex: number;
	private listFriend: any[];
    private currentUserId: number;

	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public viewCtrl: ViewController,
		public modalCtrl: ModalController,
		public userProvider: UserProvider,
		public employerProfileProvider: EmployerProfileProvider,
		public employeeProfileProvider: EmployeeProfileProvider,
		private callNumber: CallNumber
	) {
		this.listFriend = navParams.data.arrayFriends.friends;
		this.listFriend.forEach(d => {
			this.userProvider.getBasicInfo(d.userId).subscribe(response => {
				if (response.employer) {
					this.employerProfileProvider.getEmployerProfileByUserId(d.userId).subscribe(response1 => {
						Object.assign(d, {contactPhone: response1.contactPhone});
					});
				}
			});
			//this.employeeProfileProvider.getEmployeeProfileByUserId(d.userId).subscribe(response => {
			//	console.log(response);
				//});
		});
        this.currentUserId = this.navParams.data.currentUserId;
        this.heightIndex = window.screen.height - 120;
	}

	ionViewDidLoad(): void {
			console.log('ionViewDidLoad ProfileAlertPage');
	}

	// dismiss
	dismiss(): void {
			this.viewCtrl.dismiss();
	}

	callThePerson(item: any): void {
		if (item.contactPhone) {
			this.callNumber.callNumber(item.contactPhone, false);
		}
	}

	// show modal interview
    setAnAppointment(item: any): void {
		const title: string = 'Schedule an Interview';
		const placeholderValue: string = 'Please provide details of the upcoming interview/meeting';
		let modalDatePicker: any = this.modalCtrl.create('AppointmentAlert', { requestorUserId: this.currentUserId, targetUserId: item.userId, title: title, placeholderVal: placeholderValue}, {enableBackdropDismiss: false, cssClass: 'datepicker-modal'});
		modalDatePicker.present();
	}

}
