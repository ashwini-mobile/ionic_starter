import { Component, ViewChild, Input, Output, EventEmitter  } from '@angular/core';
import { IonicPage, ModalController, NavController, Platform } from 'ionic-angular';
import { UserProvider } from '../../providers/user-provider';
import { Utilities } from '../../providers/utilities/app-utilities';
import { Settings } from '../../providers/utilities/app-settings';
import * as $ from 'jquery';

@IonicPage()
@Component({
	selector: 'page-signup',
	templateUrl: 'signup.html'
})
export class Signup {
	private heightWindow: number;
	private txtFullName: string;
	private txtEmail: string;
	private txtPassword: string;
	private txtPasswordConfirm: string;

	public errorFullName: boolean = false;
	public errorEmail: boolean = false;
	public errorPassword: boolean = false;
	public errorPasswordConfirm: boolean = false;

	@ViewChild('fullNameInput') fullNameInput: any;
	@ViewChild('emailInput') emailInput: any;
	@ViewChild('passInput') passInput: any;
	@ViewChild('confirmPassInput') confirmPassInput: any;

	@Input('nav') nav: NavController = null;
	@Output('') closeSignup: EventEmitter<{}> = new EventEmitter();
	@Output('') showLogin: EventEmitter<{}> = new EventEmitter();

	private authUrlFacebook: string;
	private authUrlLinkedIn: string;
	private authUrlGoogle: string;

	constructor (public modalCtrl: ModalController,
	             public userProvider: UserProvider,
	             private settings: Settings,
				 private platform: Platform) {
		this.txtFullName = '';
		this.txtEmail = '';
		this.txtPassword = '';

		this.authUrlFacebook = this.settings.apiEndpoint + '/auth/facebook';
		this.authUrlLinkedIn = this.settings.apiEndpoint + '/auth/linkedIn';
		this.authUrlGoogle = this.settings.apiEndpoint + '/auth/google';
		this.heightWindow = 550;
		setTimeout(function(): void {
			$('.typing-here').css('pointer-events', 'auto');
		}, 500);

		let that: any = this;
		this.platform.ready().then((readySource) => {
			if (that.platform.is('android')) {
				window.addEventListener('native.keyboardshow', that.keyboardWillShowHandler);
				window.addEventListener('native.keyboardhide', that.keyboardWillHideHandler);
			}
		});
	}

	keyboardWillShowHandler(e: any): void {
		$('.signup-page').animate({top: -60}, 100);
	}

	keyboardWillHideHandler(e: any): void {
		$('.signup-page').animate({top: 0}, 100);
	}

	goBack (): void {
		this.closeSignup.emit();
	}

	signup (): void {
		if (this.fullNameInput.hasError('required')) {
			this.errorFullName = true;
		}
		if (this.emailInput.hasError('required') || this.emailInput.hasError('email')) {
			this.errorEmail = true;
		}
		if (this.passInput.hasError('required')) {
			this.errorPassword = true;
		}
		if (this.confirmPassInput.hasError('required')) {
			this.errorPasswordConfirm = true;
		}
		if (this.txtPassword !== this.txtPasswordConfirm) {
			this.errorPassword = true;
			this.errorPasswordConfirm = true;
		}
		if (this.txtFullName !== '' && this.txtEmail !== '' && this.txtPassword !== '' && this.txtPassword === this.txtPasswordConfirm) {
			this.userProvider.signup({
				local: {
					'email': this.txtEmail,
					'username': this.txtFullName,
					'password': this.txtPassword,
				},
			}).subscribe(response => {
					this.showAlert('We\'ve sent an email to ' + this.txtEmail + '. Please click the link in that message to activate your account.',
						() => {
							this.showLogin.emit();
						});
				},
				error => {
					console.log(error);
					this.errorFullName = Utilities.checkErrorField(error, 'username');
					this.errorEmail = Utilities.checkErrorField(error, 'email');
					this.errorPassword = Utilities.checkErrorField(error, 'password');
				});
		}
	}

	showAlert (message: string, action: any): void {
		let alertModal: any = this.modalCtrl.create('AlertPage', {
			text: message
		}, { enableBackdropDismiss: false });
		alertModal.onDidDismiss(action);
		alertModal.present();
	}

	loginLinkedIn (): void {
		this.redirectToUrl(this.authUrlLinkedIn);
	}

	loginFacebook (): void {
		this.redirectToUrl(this.authUrlFacebook);
	}

	loginGoogle (): void {
		this.redirectToUrl(this.authUrlGoogle);
	}

	redirectToUrl (url: string): void {
		window.open(url, '_system');
	}
}
