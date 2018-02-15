import { Component, ViewChild, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { DataSvcProvider } from '../../providers/data-svc/data-svc';
import { Activity } from '../../providers/data-svc/activity';
import { Dashboard } from '../dashboard/dashboard';

@IonicPage()
@Component({
	selector: 'page-activity',
	templateUrl: 'activity.html',
  providers: [Dashboard]
})
export class ActivityPage implements OnInit{
  rootNavCtrl: NavController;
	public title: string = '';
  private listActivity: Activity[];
  private heightIndex: number;
  constructor(
      public navCtrl: NavController,
      public navParams: NavParams,
      public viewCtrl: ViewController,
      private dataSvc: DataSvcProvider,
      private dasboardCtrl: Dashboard
    ) {
      this.title = navParams.data.title;
      this.heightIndex = window.screen.height - 125;
  }

	ngOnInit(): void {
		this.dataSvc.loadDataActivitys().then(res => {
			this.listActivity = res;
		});
	}

  ionViewDidLoad(): void {
      console.log('ionViewDidLoad ActivityAlertPage');
  }

  // dismiss
  dismiss(): void {
      this.viewCtrl.dismiss();
  }

  // go Profile Page
  goProfilePage(item: any): void {
    this.dasboardCtrl.goSlideToPage(2);
  }
}
