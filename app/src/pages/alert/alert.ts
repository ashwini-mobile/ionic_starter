import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';

/**
 * Generated class for the AlertPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-alert',
    templateUrl: 'alert.html',
})
export class AlertPage {

    public text: string = '';
    public noHeader: boolean = false;
    public title: string = '';
    public image: string = null;
    public buttonText: string = null;

    constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
        this.text = navParams.data.text;
        this.title = navParams.data.title;
        this.noHeader = navParams.data.noHeader;
        this.image = navParams.data.image;
        this.buttonText = navParams.data.buttonText;
    }

    ionViewDidLoad(): void {
        console.log('ionViewDidLoad AlertPage');
    }

    // dismis
    dismiss(): void {
        this.viewCtrl.dismiss();
    }

}
