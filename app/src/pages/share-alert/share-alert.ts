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
    selector: 'page-share-alert',
    templateUrl: 'share-alert.html',
})
export class ShareAlert {
    public title: string = '';
    public links: object = {};
    constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
        this.title = navParams.data.title;
        this.links = navParams.data.link;
    }

    ionViewDidLoad(): void {
        console.log('ionViewDidLoad ShareAlertPage');
    }

    // dismiss
    dismiss(): void {
        this.viewCtrl.dismiss();
    }
}
