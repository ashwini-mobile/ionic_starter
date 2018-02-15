import { Component, ViewChild, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { DataSvcProvider } from '../../providers/data-svc/data-svc';
import { SubscriptionProvider } from '../../providers/subscription-provider';

@IonicPage()
@Component({
	selector: 'page-select-subscription-alert',
	templateUrl: 'select-subscription-alert.html'
})
export class SelectSubscriptionAlert implements OnInit{
	rootNavCtrl: NavController;
	private listSubcriptions: any[];
	constructor(
		public nav: NavController,
		public navParams: NavParams,
		public viewCtrl: ViewController,
		private svcService: DataSvcProvider,
		private subscriptionProvider: SubscriptionProvider
	) {
		this.rootNavCtrl = navParams.get('rootNavCtrl');
	}
	ngOnInit(): void {
		this.subscriptionProvider.getSubscriptions().subscribe(res => {
			this.listSubcriptions = res;
		});
	}
	// dismiss
	dismiss(): void {
		this.viewCtrl.dismiss();
	}

	// select subcription
	selectSubcription(item: any): void {
		this.viewCtrl.dismiss(item);
	}
}
