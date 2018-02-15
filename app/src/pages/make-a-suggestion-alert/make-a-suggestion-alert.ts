import { Component, ViewChild, NgZone } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ModalController } from 'ionic-angular';
import { SuggestionProvider } from '../../providers/suggestion-provider';

@IonicPage()
@Component({
	selector: 'page-make-a-suggestion-alert',
	templateUrl: 'make-a-suggestion-alert.html'
})
export class MakeASuggestionAlert {
	private txtFullName: string = '';
	private txtEmail: any = '';
    private txtDesc: string;

	private requestorUserId: number;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public viewCtrl: ViewController,
        public modalCtrl: ModalController,
		private suggestionProvider: SuggestionProvider
    ) {}

    ionViewDidLoad(): void {
        console.log('ionViewDidLoad MakeASuggestionAlert');
        this.requestorUserId = this.navParams.data.requestorUserId;
    }

    // send
    send(): void {
		this.suggestionProvider.create({
			'requestorUserId': this.requestorUserId,
			'email': this.txtEmail,
			'query': this.txtDesc
		}, false).subscribe(response => {}, error => {
			console.log('Error in sending suggestion');
			console.log(error);
		});

        this.dismiss();
    }

    // dismiss
    dismiss(): void {
        this.viewCtrl.dismiss();
    }

}
