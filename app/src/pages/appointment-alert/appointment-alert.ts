import { Component, ViewChild, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ModalController } from 'ionic-angular';
import { DatePipe } from '@angular/common';
import { DatePickerDirective } from 'datepicker-ionic2';
import { InterviewProvider } from '../../providers/interview-provider';

@IonicPage()
@Component({
	selector: 'page-appointment-alert',
	templateUrl: 'appointment-alert.html',
	providers: [DatePipe]
})
export class AppointmentAlert {
	private dateSet: Date = new Date();
	private txtTimeSet: string = '';
	private txtDateSet: any = '';
    private txtMsg: string;

	@ViewChild(DatePickerDirective) private datepickerDirective: DatePickerDirective;

	private requestorUserId: number;
	private targetUserId: number;
	private title: string;
	private placeholderValue: string;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public viewCtrl: ViewController,
        public modalCtrl: ModalController,
        private datePipe: DatePipe,
        private interviewProvider: InterviewProvider
    ) {}

    ionViewDidLoad(): void {
        console.log('ionViewDidLoad OfficesAlertPage');
        this.requestorUserId = this.navParams.data.requestorUserId;
        this.targetUserId = this.navParams.data.targetUserId;
	this.title = this.navParams.data.title;
	this.placeholderValue = this.navParams.data.placeholderVal;
    }

    // send
    send(): void {
        this.interviewProvider.create({
            'requestorUserId': this.requestorUserId,
            'targetUserId': this.targetUserId,
            'message': this.txtMsg,
            'date': this.txtDateSet + ' ' + this.txtTimeSet
        }, true).subscribe(response => {}, error => {
            console.log('Error in setting interview');
            console.log(error);
        });

        this.dismiss();
    }

    // dismiss
    dismiss(): void {
        this.viewCtrl.dismiss();
    }

    // call bacl date
    setDate(event: any): void {
        // this.txtDateSet = this.datePipe.transform(event, 'MM/dd/yyyy');
        this.txtDateSet = this.datePipe.transform(event, 'yyyy-MM-dd');
        this.dateSet = event;
    }
    // show Time picker
    showTimePicker(): void {
        let timePicker: any;
        if (this.dateSet) {
            timePicker = this.modalCtrl.create('TimePickerAlert', {dateSet : this.dateSet}, {enableBackdropDismiss: false, cssClass: 'timepicker-modal'});
        } else {
            timePicker = this.modalCtrl.create('TimePickerAlert', {dateSet : new Date()}, {enableBackdropDismiss: false, cssClass: 'timepicker-modal'});
        }
        timePicker.present();
        timePicker.onDidDismiss((data: any) => {
            if (data) {
                this.dateSet = data;
                this.txtTimeSet = this.datePipe.transform(data, 'hh:mm:ss');
            }
        });
    }

}
