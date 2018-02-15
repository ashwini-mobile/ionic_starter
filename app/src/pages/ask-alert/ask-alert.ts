import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';

@IonicPage()
@Component({
    selector: 'page-ask-alert',
    templateUrl: 'ask-alert.html',
})
export class AskAlert {
	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public viewCtrl: ViewController
	) {}
	ionViewDidLoad(): void {
        console.log('ionViewDidLoad ProfileAlertPage');
    }

	// dismiss
	dismiss(): void {
		this.viewCtrl.dismiss();
	}

}
