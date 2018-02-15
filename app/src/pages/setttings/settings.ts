import { Component, ViewChild } from '@angular/core';
import { IonicPage, ModalController, NavController, ViewController } from 'ionic-angular';
import { UserProvider } from '../../providers/user-provider';
import { AuthToken } from '../../providers/utilities/api/auth-token';


@IonicPage()
@Component({
	selector: 'page-settings',
	templateUrl: 'settings.html'
})
export class SettingsPage {

    private heightIndex: number;
    private currentUser: any;
	private currentUserId: number;
	private currentSetting: string = '';
    private updateIsDisabledSinceUserIsSocial: boolean = false;

	private txtCurrentEmail: string = '';
	private txtNewEmail: string = '';
	private errorNewEmail: boolean = false;
	private isSavingEmail: boolean = false;

	private txtCurrentPassword: string = '';
	private txtNewPassword: string = '';
	private txtConfirmNewPassword: string = '';
    private errorCurrentPassword: boolean = false;
    private errorNewPassword: boolean = false;
    private errorConfirmNewPassword: boolean = false;
    private isSavingPassword: boolean = false;


	public notifications: any = [
		{
			name: 'New Messages',
			code: 'newMessages',
			enabled: false
		},
		{
			name: 'Friend Request',
			code: 'friendRequests',
			enabled: false
		},
		{
			name: 'Match Requests',
			code: 'matchRequests',
			enabled: false
		},
		{
			name: 'A Match views me',
			code: 'aMatchViewsMe',
			enabled: false
		},
		{
			name: 'Someone liked me back',
			code: 'someoneLikedMeBack',
			enabled: false
		},
		{
			name: 'Phone interview request',
			code: 'phoneInterviewRequest',
			enabled: false
		},
		{
			name: 'New app features',
			code: 'newAppFeatures',
			enabled: false
		}
	];

	public purchases: any = [
		{
			title: 'Subscription ID',
			value: '0193124819407'
		},
		{
			title: 'Username',
			value: 'RV4309'
		},
		{
			title: 'Payment Type',
			value: 'Apple App Store'
		},
		{
			title: 'Subscription',
			value: '$24.99 every month'
		},
		{
			title: 'Purchase Date',
			value: '5/21/2017'
		},
		{
			title: 'Next Billing Date',
			value: '7/21/2017'
		},
		{
			title: 'Active Boosts Validity',
			value: '7/21/2017'
		}
	];

	public legal: any = [
		{
			name: 'Privacy Policy',
			enabled: false
		},
		{
			name: 'Terms of Use',
			enabled: false
		},
		{
			name: 'Licenses',
			enabled: false
		},
	];


	constructor(
		public nav: NavController,
        public viewCtrl: ViewController,
		public modalCtrl: ModalController,
		private userProvider: UserProvider,
		private authToken: AuthToken
	) {
        this.heightIndex = window.screen.height - 125;
	}

    ionViewDidLoad(): void {
        console.log('ionViewDidLoad SettingsPage');
		this.userProvider.getCurrentUser().subscribe(
			response => {
				this.refreshCurrentuser(response);
            },
			error => {
				console.log('Error in retrieving current user info');
				console.log(error);
			}
		);
	}

	refreshCurrentuser(user: any): void {
        this.currentUser = user;
        delete this.currentUser.notificationPreferences.id;
        delete this.currentUser.types;
        delete this.currentUser.photos;
        this.currentUserId = user.id;
        this.notifications.find(n => n.code === 'newMessages').enabled = user.notificationPreferences.newMessages;
        this.notifications.find(n => n.code === 'friendRequests').enabled = user.notificationPreferences.friendRequests;
        this.notifications.find(n => n.code === 'matchRequests').enabled = user.notificationPreferences.matchRequests;
        this.notifications.find(n => n.code === 'aMatchViewsMe').enabled = user.notificationPreferences.aMatchViewsMe;
        this.notifications.find(n => n.code === 'someoneLikedMeBack').enabled = user.notificationPreferences.someoneLikedMeBack;
        this.notifications.find(n => n.code === 'phoneInterviewRequest').enabled = user.notificationPreferences.phoneInterviewRequest;
        this.notifications.find(n => n.code === 'newAppFeatures').enabled = user.notificationPreferences.newAppFeatures;
        this.txtCurrentEmail = user.local.email || user.facebook.email || user.google.email || user.linkedIn.email;
        this.updateIsDisabledSinceUserIsSocial = user.facebook.email !== undefined || user.google.email !== undefined || user.linkedIn.email !== undefined;
	}

    goBack(): void{
		this.nav.pop();
	}

    // dismiss
    dismiss(): void {
        this.viewCtrl.dismiss();
    }

	// help
	getHelp(): void {
		this.currentSetting = '';
		let modalHelp: any = this.modalCtrl.create('HelpAlert', { requestorUserId: this.currentUserId }, { cssClass: 'modal-help-alert' });
		modalHelp.present();
	}

	// contact us
	contactUs(): void {
		this.currentSetting = '';
		let modalContactUs: any = this.modalCtrl.create('ContactUsAlert', { requestorUserId: this.currentUserId }, { cssClass: 'modal-contact-us-alert' });
		modalContactUs.present();
	}

	// make a suggestion
	makeASuggestion(): void {
		this.currentSetting = '';
		let modalMakeASuggestion: any = this.modalCtrl.create('MakeASuggestionAlert', { requestorUserId: this.currentUserId }, { cssClass: 'modal-make-a-suggestion-alert' });
		modalMakeASuggestion.present();
	}

	// select setting
	selectSetting(settingType: string): void {
		if (this.currentSetting === settingType) {
			if (settingType === 'email' && this.isSavingEmail) {
				this.isSavingEmail = false;
				return;
			} else if (settingType === 'password' && this.isSavingPassword) {
                this.isSavingPassword = false;
                return;
            } else {
                this.currentSetting = '';
            }
		} else {
			this.currentSetting = settingType;
		}
	}

	togglePreferences(code: string, event: any): void  {
        this.currentUser.notificationPreferences[code] = this.notifications.find(n => n.code === code).enabled;
        this.userProvider.updateUser(this.currentUserId, this.currentUser, true).subscribe(response => {
            this.refreshCurrentuser(response);
        }, error => {
            console.log('Error updating preferences - ' + code);
            console.log(error);
        });
	}

	saveEmail(): void {
		console.log('saving email');
		this.isSavingEmail = true;
		if (this.txtNewEmail === '') {
            this.errorNewEmail = true;
            return;
		}
		this.currentUser.local.email = this.txtNewEmail;
		this.userProvider.updateUser(this.currentUserId, this.currentUser).subscribe(response => {
            this.clearEmailFields();
            this.isSavingEmail = false;
		}, error => {
            if (error.message.length > 0 && error.message[0].message.indexOf('must be a valid email') >= 0) {
                this.errorNewEmail = true;
            }
            this.isSavingEmail = false;
            console.log('Error updating email');
            console.log(error);
		});
	}

	savePassword(): void {
		console.log('saving password');
        this.isSavingPassword = true;
		this.errorCurrentPassword = this.txtCurrentPassword === '';
        this.errorNewPassword = this.txtNewPassword === '';
        this.errorConfirmNewPassword = this.txtConfirmNewPassword === '';
        if (this.errorCurrentPassword || this.errorNewPassword || this.errorConfirmNewPassword) {
        	return;
		}
		this.errorNewPassword = this.txtNewPassword !== this.txtConfirmNewPassword;
		if (this.errorNewPassword) {
			this.errorConfirmNewPassword = this.errorNewPassword;
			return;
		}
		this.userProvider.updatePassword({
			'newPassword': this.txtNewPassword,
			'oldPassword': this.txtCurrentPassword
		}).subscribe(response => {
            this.clearPasswordFields();
            this.isSavingPassword = false;
		}, error => {
 			if (error.message.indexOf('old password error') >= 0) {
				this.errorCurrentPassword = true;
			}
            this.isSavingPassword = false;
            console.log('Error updating password');
            console.log(error);
		});
	}

    clearEmailFields(): void {
        this.currentSetting = '';
        this.txtNewEmail = '';
    }

    clearPasswordFields(): void {
        this.currentSetting = '';
        this.txtCurrentPassword = '';
        this.txtNewPassword = '';
        this.txtConfirmNewPassword = '';
	}

    logout(): void {
		this.authToken.setToken(null);
		// this.nav.push('Welcome');
		// this.nav.setRoot('Welcome');
		this.viewCtrl.dismiss({'needLogout': true});
    }
}
