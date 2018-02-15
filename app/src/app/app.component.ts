import { Component, ViewChild } from '@angular/core';
import { Platform, Events, Config, Nav } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { TranslateService } from '@ngx-translate/core';
import { ModalLeaveTransition } from './modal-leave-transition';
import { ModalEnterTransition } from './modal-enter-transition';
import { ModalEnterTransitionIOS } from './modal-enter-transition-ios';
import { ModalNofLeaveTransition } from './modal-notification-leave-transition';
import { ModalNofEnterTransition } from './modal-notification-enter-transiction';
import { ModalDetailCardEnterTransition } from './modal-detail-card-enter-transition';
import { ModalDetailCardLeaveTransition } from './modal-detail-card-leave-transition';
import { Deeplinks } from '@ionic-native/deeplinks';
import { AuthToken } from '../providers/utilities/api/auth-token';

@Component({
	templateUrl: 'app.html'
})
export class MyApp {
	public rootPage: string = 'Landing';
	public menuContent: any = {};
	@ViewChild(Nav) nav: Nav;

	constructor (private platform: Platform,
	             private events: Events,
	             private translate: TranslateService,
	             private statusBar: StatusBar,
	             private splashScreen: SplashScreen,
	             public config: Config,
	             private authToken: AuthToken,
	             private deeplinks: Deeplinks) {
		const item: any = localStorage.getItem('loggedIn');
		if (item !== undefined && item === 'true') {
			this.rootPage = 'Welcome';
		}

		this.platform.ready().then(() => {
			// Okay, so the platform is ready and our plugins are available.
			// Here you can do any higher level native things you might need.
			this.statusBar.styleDefault();
			this.splashScreen.hide();

			this.translate.setDefaultLang('en');
			this.translate.use('en');
			this.setCustomTransitions();
			this.parseDeepLink();
		});

		this.events.subscribe('menuContentUpdate', (menuData: any) => {
			if (menuData) {
				this.menuContent = menuData;
			}
		});

		this.platform.resume.subscribe(() => {
			this.parseDeepLink();
		});
	}

	private parseDeepLink (): void {
		this.deeplinks.route({}).subscribe(() => {
		}, (nomatch) => {
			if (!nomatch.$link.url) return;
			const url: string = nomatch.$link.url;
			if (url.indexOf('login') > 0) {
				const args: any = this.parseUrl(url);
				this.authToken.setToken(args.token.split('#')[0]);
				this.events.publish('user:login');
			}
		});
	}

	private parseUrl (url: string): any {
		url = url.replace(/^((?:.*)\?)/, '');
		const result: any = {};
		url.split('&').forEach(part => {
			const item: string[] = part.split('=');
			result[item[0]] = decodeURIComponent(item[1]);
		});
		return result;
	}


	private setCustomTransitions (): void {
		this.config.setTransition('modal-transition-leave', ModalLeaveTransition);
		this.config.setTransition('modal-transition-enter', ModalEnterTransition);
		this.config.setTransition('modal-transition-enter-ios', ModalEnterTransitionIOS);
		this.config.setTransition('modal-nof-transition-leave', ModalNofLeaveTransition);
		this.config.setTransition('modal-nof-transition-enter', ModalNofEnterTransition);
		this.config.setTransition('modal-detail-card-transition-enter', ModalDetailCardEnterTransition);
		this.config.setTransition('modal-detail-card-transition-leave', ModalDetailCardLeaveTransition);
	}
}
