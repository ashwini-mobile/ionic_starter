import { Injectable } from '@angular/core';
import { ModalController } from 'ionic-angular';

import { ApiGateway } from './api-gateway';

@Injectable()
export class HttpErrorHandler {
	private modalShow: boolean = false;

	constructor(
		private apiGateway: ApiGateway,
		private modalCtrl: ModalController
	) {
		const self: any = this;

		this.apiGateway.errorsObservable.subscribe((value: any) => {
			console.group('HttpErrorHandler');
			console.log(value.status, 'status code detected.');
			// console.dir(value);
			console.groupEnd();

			if (value.status === 400) {
				console.log('Invalid Authorization Code');
			}
			if (value.status === 401) {
				console.log('Not Authorized');
			}

			// display error to user
			if (value.status === 400 && !self.modalShow) {
				const original: any = value.json();
				let error: any;
				if (typeof original.message === 'string') {
					error = original.message;
				} else {
					error = original.message[0].message;
				}
				self.modalShow = true;
				let alertModal: any = self.modalCtrl.create('ErrorAlertPage', { title: 'Error', message: error });
				alertModal.onDidDismiss(() => self.modalShow = false);
				alertModal.present();
			}

		});
	}
}
