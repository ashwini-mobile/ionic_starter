import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';


/**
 * Generated class for the ProfileAlertPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-sos-alert',
    templateUrl: 'sos-alert.html',
})
export class SosAlert {
	private listPosition: any[] = [
		{
			'title': 'Lorem ipsum'
		},
		{
			'title': 'Lorem ipsum'
		}
	];
	private isShowdropdown: boolean;
	private titlePosition: string = 'What Position';
	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public viewCtrl: ViewController
	) {}
	ionViewDidLoad(): void {
			console.log('ionViewDidLoad NotificationAlertPage');
	}
	// select list Position
	showSelectedPosition(): void {
		this.isShowdropdown = !this.isShowdropdown;
	}
	// select Position
	selectPosition(item: any): void {
		this.titlePosition = item.title;
		this.isShowdropdown = !this.isShowdropdown;
	}
	// dimiss
	dimissFunc(): void {
		this.viewCtrl.dismiss();
	}
}
