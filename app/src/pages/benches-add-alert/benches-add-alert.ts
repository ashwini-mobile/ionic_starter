import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';

@IonicPage()
@Component({
    selector: 'page-benches-add-alert',
    templateUrl: 'benches-add-alert.html'
})
export class BenchesAddAlertPage {
    private titleBenches: string;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public viewCtrl: ViewController
    ) {}

    ionViewDidLoad(): void {
        console.log('ionViewDidLoad OfficesAlertPage');
    }

    // dismiss
    dismiss(): void {
        this.viewCtrl.dismiss({
            title: this.titleBenches
        });
    }
}
