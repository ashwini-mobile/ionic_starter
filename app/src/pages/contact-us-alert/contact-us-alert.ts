import { Component, ViewChild, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ModalController } from 'ionic-angular';
import { ContactUsProvider } from '../../providers/contact-us-provider';

@IonicPage()
@Component({
	selector: 'page-contact-us-alert',
	templateUrl: 'contact-us-alert.html'
})
export class ContactUsAlert {
	private txtTopic: string = '';
	private txtEmail: any = '';
    private txtDesc: string;

	private requestorUserId: number;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public viewCtrl: ViewController,
        public modalCtrl: ModalController,
		private contactUsProvider: ContactUsProvider
    ) {}

    ionViewDidLoad(): void {
        console.log('ionViewDidLoad ContactUsAlert');
        this.requestorUserId = this.navParams.data.requestorUserId;
    }

    // send
    send(): void {
        this.contactUsProvider.create({
            'requestorUserId': this.requestorUserId,
            'topic': this.txtTopic,
            'email': this.txtEmail,
            'query': this.txtDesc
        }, false).subscribe(response => {}, error => {
            console.log('Error in sending contact us message');
            console.log(error);
        });

        this.dismiss();
    }

    // dismiss
    dismiss(): void {
        this.viewCtrl.dismiss();
    }

}
