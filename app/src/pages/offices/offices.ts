import {Component, OnInit} from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';
import { DataSvcProvider } from '../../providers/data-svc/data-svc';
import { Office } from '../../components/office/office';
import { Dashboard } from '../dashboard/dashboard';
/**
 * Generated class for the ProfileAlertPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
	selector: 'page-offices',
	templateUrl: 'offices.html',
	providers: [Dashboard]
})
export class OfficesPage implements OnInit{
	public title: string = '';
	public links: object = {};
	private heightIndex: number;
	private listOffices: Office[];
	private listAllOffices: Office[];
	private querySearch: string = '';
	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public viewCtrl: ViewController,
		private svcProvider: DataSvcProvider,
		private dasboardCtrl: Dashboard
	) {
			this.title = navParams.data.title;
			this.links = navParams.data.link;
			this.heightIndex = window.screen.height - 120;
	}
	ionViewDidLoad(): void {
			console.log('ionViewDidLoad ProfileAlertPage');
	}
	// dismiss
	dismiss(): void {
			this.viewCtrl.dismiss();
	}
	ngOnInit(): void {
		this.svcProvider.loadDataOffices().then(res => {
			this.listAllOffices = res;
			this.searchFunc();
		});
	}
	searchFunc(): void{
		this.listOffices = Object.assign([], this.listAllOffices).filter(item => this.compareString(item.name, this.querySearch)
		|| this.compareString(item.city, this.querySearch) || this.compareString(item.state, this.querySearch));
	}

	compareString(str1: string, str2: string): boolean{
    if (str1.toLowerCase().indexOf(str2.toLowerCase()) !== -1 || str1.toLowerCase().trim() === str2.toLowerCase().trim()){
      return true;
    }
    return false;
	}

	goProfilePage(data: any): void {
		this.dasboardCtrl.goSlideToPage(2);
	}
}