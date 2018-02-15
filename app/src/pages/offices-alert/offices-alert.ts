import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';
import { Dashboard } from '../dashboard/dashboard';

/**
 * Generated class for the ProfileAlertPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-offices-alert',
    templateUrl: 'offices-alert.html',
    providers: [Dashboard]
})
export class OfficesAlertPage {
    public title: string = '';
    public links: object = {};
    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public viewCtrl: ViewController,
        private dasboardCtrl: Dashboard
    ) {
        this.title = navParams.data.title;
        this.links = navParams.data.link;
    }

    ionViewDidLoad(): void {
        console.log('ionViewDidLoad OfficesAlertPage');
    }

    // dismiss
    dismiss(): void {
        this.viewCtrl.dismiss();
    }

    goProfilePage(data: any): void {
		this.dasboardCtrl.goSlideToPage(2);
	}
}
