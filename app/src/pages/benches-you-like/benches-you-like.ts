import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';
import { Friend } from '../../providers/data-svc/friend';
/**
 * Generated class for the ProfileAlertPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
	selector: 'page-benches-you-like',
	templateUrl: 'benches-you-like.html'
})
export class BenchesYouLikePage{
	private heightIndex: number;
	private listFriend: Friend[];
	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public viewCtrl: ViewController,
	) {
			this.listFriend = navParams.data.arrayFriends.friends;
			this.heightIndex = window.screen.height - 120;
	}
	ionViewDidLoad(): void {
			console.log('ionViewDidLoad ProfileAlertPage');
	}
	// dismiss
	dismiss(): void {
			this.viewCtrl.dismiss();
	}
}