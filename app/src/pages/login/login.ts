import { Component, Input, Output, EventEmitter } from '@angular/core';
import { IonicPage, NavController, NavParams, Platform } from 'ionic-angular';
import { SecurityProvider } from '../../providers/security-provider';
import { Utilities } from '../../providers/utilities/app-utilities';
import { AuthToken } from '../../providers/utilities/api/auth-token';
import { UserProvider } from '../../providers/user-provider';
import { Settings } from '../../providers/utilities/app-settings';
import * as $ from 'jquery';

@IonicPage({
	segment: 'login/:accessToken'
})
@Component({
	selector: 'page-login',
	templateUrl: 'login.html'
})
export class Login {
	private heightWindow: number;
	private txtEmail: string;
	private txtPassWord: string;

	private errorEmail: boolean;
	private errorPassWord: boolean;
	private errorMessage: string;
	private errorLogin: boolean;

	private authUrlFacebook: string;
	private authUrlLinkedIn: string;
	private authUrlGoogle: string;
	@Input('nav') nav: NavController = null;
	@Output('') closeLogin: EventEmitter<{}> = new EventEmitter();

	// @ViewChild('emailInput') emailInput: any;
	// @ViewChild('emailInput') passInput: any;

	constructor (public navParams: NavParams,
	             public securityProvider: SecurityProvider,
	             public userProvider: UserProvider,
	             private authToken: AuthToken,
	             private settings: Settings,
				 private platform: Platform) {
		this.txtEmail = '';
		this.txtPassWord = '';
		this.errorEmail = false;
		this.errorPassWord = false;
		this.errorMessage = '';
		this.errorLogin = false;

		let that: any = this;
		this.platform.ready().then((readySource) => {
			if (that.platform.is('android')) {
				window.addEventListener('native.keyboardshow', that.keyboardWillShowHandler);
			}
		});

		const accessToken: string = this.navParams.get('accessToken');
		if (accessToken && accessToken !== ':accessToken') {
			authToken.setToken(accessToken);
		}
		this.authUrlFacebook = this.settings.apiEndpoint + '/auth/facebook';
		this.authUrlLinkedIn = this.settings.apiEndpoint + '/auth/linkedIn';
		this.authUrlGoogle = this.settings.apiEndpoint + '/auth/google';
		this.heightWindow = window.screen.height - 30;
		const token: string = this.authToken.getToken();
		if (token != null && token !== ':accessToken') {
			this.userProvider.getCurrentUser().subscribe(response => {
				this.navigate(response.types);
			});
		}
	}

	keyboardWillShowHandler(e: any): void {
		$('.login-content').animate({scrollTop: 60}, 100);
	}

	ionViewDidLoad (): void {
	}

	navigate (types: any): void {
		if (types && types.length > 0) {
			this.nav.setRoot('Dashboard', { roleUser: types[0] });
		} else {
			this.nav.push('HearAboutUs', { title: 'HearAboutUs' });
		}
	}

	goBack (): void {
		this.closeLogin.emit();
	}

	login (): void {
		if (this.txtEmail.trim() === '') {
			this.errorEmail = true;
		}
		if (this.txtPassWord.trim() === '') {
			this.errorPassWord = true;
		}
		this.errorLogin = false;
		this.errorMessage = '';
		if (this.txtEmail !== '' && this.txtPassWord !== '') {
			this.securityProvider.login({
				'email': this.txtEmail.trim(),
				'password': this.txtPassWord,
			}).subscribe(response => {
					localStorage.setItem('loggedIn', 'true');
					this.authToken.setToken(response.accessToken);
					this.navigate(response.types);
				},
				error => {
					let invalidPassword: boolean = (error.message === 'Invalid username or password.');
					let userNotVerified: boolean = error.message === 'An attempt was made to perform an operation that is not permitted: this email is not verified.';
					this.errorEmail = Utilities.checkErrorField(error, 'email') || invalidPassword || userNotVerified;
					this.errorPassWord = invalidPassword;
					this.errorLogin = true;
					this.errorMessage = error.message;
				});
		}
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
