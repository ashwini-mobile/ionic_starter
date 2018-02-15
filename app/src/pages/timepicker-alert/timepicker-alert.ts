import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';
import { DatePipe, DecimalPipe } from '@angular/common';

/**
 * Generated class for the ProfileAlertPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
	selector: 'page-timepicker-alert',
	templateUrl: 'timepicker-alert.html',
	providers: [DatePipe]
})
export class TimePickerAlert {
	private dateSet: Date;
	private hourSet: number;
	private minuteSet: number;
	private amOrPm: string;
	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public viewCtrl: ViewController,
		private datePipe: DatePipe
	) {
		this.dateSet = new Date(this.navParams.data.dateSet);
		this.hourSet = parseInt(this.datePipe.transform(this.dateSet, 'hh'));
		this.minuteSet =  parseInt(this.datePipe.transform(this.dateSet, 'mm'));
		this.amOrPm = this.datePipe.transform(this.dateSet, 'a');
	}
	ionViewDidLoad(): void {
		console.log('ionViewDidLoad NotificationAlertPage');
	}
	closeTimepicker(): void {
		this.viewCtrl.dismiss();
	}
	selectTimePicker(): void {
		if (this.amOrPm === 'pm') {
			this.hourSet = this.hourSet + 12;
		}
		this.dateSet.setHours(this.hourSet);
		this.dateSet.setMinutes(this.minuteSet);
		this.viewCtrl.dismiss(this.dateSet);
	}
	// up hours
	upHourFunc(): void {
		if (this.hourSet < 12) {
			this.hourSet++;
		}
	}
	// down hours
	downHourFunc(): void {
		if (this.hourSet > 0) {
			this.hourSet--;
		}
	}
	// up minute
	upMinuteFunc(): void {
		if (this.minuteSet < 59) {
			this.minuteSet++;
		}
	}
	// down minute
	downMinuteFunc(): void {
		if (this.minuteSet > 59) {
			this.minuteSet--;
		}
	}
}
