import { Component } from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';

/**
 * Generated class for the StepCompletePage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-step-complete',
  templateUrl: 'step-complete.html',
})
export class StepCompletePage {

  constructor(public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
  }

  ionViewDidLoad(): void {
    console.log('ionViewDidLoad StepCompletePage');
  }

    // dismiss
    dismiss(type: any): void {
        this.viewCtrl.dismiss({type: type});
    }

}
