import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ModalController } from 'ionic-angular';

@IonicPage()
@Component({
	selector: 'page-message-alert',
	templateUrl: 'message-alert.html'
})
export class MessageAlert {
	private message: any = '';

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public viewCtrl: ViewController,
        public modalCtrl: ModalController
    ) {}

    ionViewDidLoad(): void {
        console.log('ionViewDidLoad OfficesAlertPage');
    }

    // dismiss
    dismiss(): void {
        this.viewCtrl.dismiss(this.message);
    }

}
