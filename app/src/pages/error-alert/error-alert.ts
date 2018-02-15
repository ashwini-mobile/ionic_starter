import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';

/**
 * Generated class for the ErrorAlertPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-error-alert',
    templateUrl: 'error-alert.html',
})
export class ErrorAlertPage {

    public title: string = '';
    public message: string = '';
    public buttonText: string = null;

    constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
        this.title = navParams.data.title;
        this.message = navParams.data.message;
        this.buttonText = navParams.data.buttonText;
    }

    ionViewDidLoad(): void {
        console.log('ionViewDidLoad ErrorAlertPage');
    }

    // dismis
    dismiss(): void {
        this.viewCtrl.dismiss();
    }

}
