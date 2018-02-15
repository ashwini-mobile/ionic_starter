import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ViewController } from 'ionic-angular';
import { UserProvider } from '../../providers/user-provider';
import { MessageProvider } from '../../providers/message-provider';

/**
 * Generated class for the MessagesPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-messages',
  templateUrl: 'messages.html',
})
export class MessagesPage {
	private arrayData: any[] = [];
	// example
	// [
	// 	{
	// 		img: 'assets/img/sm-stock01.png',
	// 		name: 'Kylie Bourne',
	// 		location: 'Orthodontist',
	// 		desc: 'It’s rare that you come across a standout talent like Lyanna teger mollis nisl dictum lectus pulvinar temp and . Donecti feugiat bibendum magna vela tinmont'
	// 	},
	// 	{
	// 		img: 'assets/img/sm-stock02.png',
	// 		name: 'Kelly Brown',
	// 		location: 'Dental Hygienist',
	// 		desc: 'It’s rare that you come across a standout talent like Lyanna teger mollis nisl dictum lectus pulvinar temp and . Donecti feugiat bibendum magna vela tinmont'
	// 	}
	// ];
	private friend: any;
	private user: any;
	private defaultPhoto1: string = 'assets/img/sm-stock01.png';
	private defaultPhoto2: string = 'assets/img/sm-stock02.png';
	constructor(
		public nav: NavController,
		public navParams: NavParams,
		public modalCtrl: ModalController,
		public viewCtrl: ViewController,
		private userProvider: UserProvider,
		private messageProvider: MessageProvider
	) {
		this.friend = this.navParams.data.friend;
		this.user = this.navParams.data.user;
		let that: any = this;
		this.user.name = this.user.username || this.user.name;
		if (this.user.name === null || this.user.name === undefined) {
			this.user.name = this.user.local.username || this.user.local.name;
		}
		this.friend.name = this.friend.username || this.friend.name;
		if (this.friend.name === null || this.friend.name === undefined) {
			this.friend.name = this.friend.local.username || this.friend.local.name;
		}
		if (that.user.photos && that.user.photos.length > 0) {
			that.user.img = that.user.photos[0].url;
		} else { that.user.img = that.defaultPhoto1; }
		if (that.friend.photos && that.friend.photos.length > 0) {
			that.friend.img = that.friend.photos[0].url;
		} else { that.friend.img = that.defaultPhoto2; }
		that.retrieveMessages();
	}
	retrieveMessages(): void {
		let that: any = this;
        that.messageProvider.search(that.user.id, that.friend.id, null, null, null).subscribe(
        	response => {
                let messageList: any = response.items;

                that.messageProvider.search(that.friend.id, that.user.id, null, null, 'new').subscribe(
                    response1 => {
						messageList = messageList.concat(response1.items);
						messageList.sort((left, right): number => {
							if (left.createdAt < right.createdAt) return -1;
							if (left.createdAt > right.createdAt) return 1;
							return 0;
						});
						console.log(messageList);
						that.arrayData = [];
						for (let i: number = 0; i < messageList.length; i++) {
							let message: any = messageList[i];
							message.desc = message.text;
							// if (message.recipientUserId === that.user.id) {
							if (message.senderUserId === that.user.id) {
								message.img = that.user.img;
								message.name = that.user.name;
								message.location = that.user.status;
							} else {
								message.img = that.friend.img;
								message.name = that.friend.name;
								message.location = that.friend.status;
							}
							that.arrayData.push(message);
						}
					});
				});
	}
	goBack(): void {
		this.nav.pop();
	}

	ionViewDidLoad(): void {
	}

	// dismiss
	dismiss(): void {
		this.arrayData = [];
		this.viewCtrl.dismiss();
	}

	removeItem(post: any): void{
		this.arrayData.splice(post, 1);
	}

  	showAddMessenger(): void {
		let that: any = this;
		let modalMessage: any = this.modalCtrl.create('MessageAlert', { }, {
			enableBackdropDismiss: true
		});
		modalMessage.present();
		modalMessage.onDidDismiss((message: any) => {
			if (message) {
				this.messageProvider.create({
					'senderUserId': this.user.id,
					'recipientUserId': this.friend.id,
					'text': message
				}).subscribe(response => {
					let messageObj: any = {
						desc: message,
						img: that.user.img,
						name: that.user.name,
						location: that.user.status
					};
					that.arrayData.push(messageObj);

				}, error => {
					console.log('Error in sending message');
					console.log(JSON.stringify(error));
				});
			}
		});
	}

}
