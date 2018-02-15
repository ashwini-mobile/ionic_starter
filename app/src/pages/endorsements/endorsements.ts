import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, ViewController, AlertController, ModalController } from 'ionic-angular';

@IonicPage()
@Component({
	selector: 'page-endorsements',
	templateUrl: 'endorsements.html'
})
export class EndorsementsPage {
	private editPeople: boolean = false;
	private arrayData: any[] = [
		{
			img: 'assets/img/sm-stock01.png',
			name: 'Kylie Bourne',
			location: 'Orthodontist',
			desc: 'It’s rare that you come across a standout talent like Lyanna teger mollis nisl dictum lectus pulvinar temp and . Donecti feugiat bibendum magna vela tinmont'
		},
		{
			img: 'assets/img/sm-stock02.png',
			name: 'Kelly Brown',
			location: 'Dental Hygienist',
			desc: 'It’s rare that you come across a standout talent like Lyanna teger mollis nisl dictum lectus pulvinar temp and . Donecti feugiat bibendum magna vela tinmont'
		},
		{
			img: 'assets/img/sm-stock03.png',
			name: 'Simon Mignolet',
			location: 'Dental Front Office',
			desc: 'It’s rare that you come across a standout talent like Lyanna teger mollis nisl dictum lectus pulvinar temp and . Donecti feugiat bibendum magna vela tinmont'
		},
		{
			img: 'assets/img/sm-stock04.png',
			name: 'Andy Carroll',
			location: 'Orthodontist',
			desc: 'It’s rare that you come across a standout talent like Lyanna teger mollis nisl dictum lectus pulvinar temp and . Donecti feugiat bibendum magna vela tinmont'
		}
	];
	constructor(
		public nav: NavController, public viewCtrl: ViewController, public alertCtrl: AlertController, public modalCtrl: ModalController
	) {
		console.log('welcome');
	}
	goBack(): void {
		this.nav.pop();
	}

	ionViewDidLoad(): void {
      console.log('ionViewDidLoad OfficesAlertPage');
  }

  // dismiss
  dismiss(): void {
    this.viewCtrl.dismiss();
	}

  removeItem(post: any): void{
    this.arrayData.splice(post, 1);
  }

  showAddMessenger(): void {
		let modalAsk: any = this.modalCtrl.create('AskAlert', {}, {showBackdrop: false, cssClass: 'modal-page-ask'});
		// alertModal callback
		modalAsk.onDidDismiss((data: any) => {
		});
		modalAsk.present();
	}
}
