import {Component} from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';

@IonicPage()
@Component({
    selector: 'page-benches-alert',
    templateUrl: 'benches-alert.html'
})
export class BenchesAlertPage {
  private titleBenches: string;
  constructor(
      public navCtrl: NavController,
      public navParams: NavParams,
      public viewCtrl: ViewController
  ) {
      this.titleBenches = navParams.data.benches;
  }

  ionViewDidLoad(): void {
    console.log('ionViewDidLoad OfficesAlertPage');
  }

  // dismiss
  renameFunc(): void {
    if (this.titleBenches !== '') {
      let result: any = {
        action : 'rename',
        data: this.titleBenches
      };
      this.viewCtrl.dismiss(result);
    }
  }

  //delete item
  deleteFunc(): void{
    let result: any = {
      action : 'delete'
    };
    this.viewCtrl.dismiss(result);
  }
  // cancel
  cancelFunc(): void {
    let result: any = {
      action : 'cancel'
    };
    this.viewCtrl.dismiss(result);
  }
}
