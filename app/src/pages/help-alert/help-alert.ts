import { Component, ViewChild, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ModalController } from 'ionic-angular';
import { HelpProvider } from '../../providers/help-provider';

@IonicPage()
@Component({
	selector: 'page-help-alert',
	templateUrl: 'help-alert.html'
})
export class HelpAlert {
	private txtEmail: any = '';
    private txtDesc: string;

	private requestorUserId: number;
	private targetUserId: number;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public viewCtrl: ViewController,
        public modalCtrl: ModalController,
		private helpProvider: HelpProvider
    ) {}

    ionViewDidLoad(): void {
        console.log('ionViewDidLoad HelpAlert');
        this.requestorUserId = this.navParams.data.requestorUserId;
    }

    // send
    send(): void {
		this.helpProvider.create({
			'requestorUserId': this.requestorUserId,
			'email': this.txtEmail,
			'query': this.txtDesc
		}, false).subscribe(response => {}, error => {
			console.log('Error in sending help request');
			console.log(error);
		});

        this.dismiss();
    }

    // dismiss
    dismiss(): void {
        this.viewCtrl.dismiss();
    }

}
