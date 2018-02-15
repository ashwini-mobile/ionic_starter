import { NgModule, ErrorHandler, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule } from 'ionic-angular';
import { FormsModule } from '@angular/forms';
import { Http } from '@angular/http';
import { IonicStorageModule } from '@ionic/storage';

import { MyApp } from './app.component';
import { SharedModule } from './shared.module';
import { ProvidersModule } from '../providers/providers.module';
import { SuperTabsModule } from 'ionic2-super-tabs';
import { Deeplinks } from '@ionic-native/deeplinks';
// Http error handler
import { HttpErrorHandler } from '../providers/utilities/api/http-error-handler';
import { GoogleMaps } from '@ionic-native/google-maps';
import { Camera } from '@ionic-native/camera';
import { DatePickerModule } from 'datepicker-ionic2';
import { SwingModule } from 'angular2-swing';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { CallNumber } from '@ionic-native/call-number';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { Geolocation } from '@ionic-native/geolocation';
import { NativeGeocoder, NativeGeocoderReverseResult, NativeGeocoderForwardResult } from '@ionic-native/native-geocoder';
import { OpenNativeSettings } from '@ionic-native/open-native-settings';
import { SearchFilterServiceProvider } from '../providers/search-filter-service/search-filter-service';
import { AndroidPermissions } from '@ionic-native/android-permissions';

export function createHttpErrorHandler (httpErrorHandler: HttpErrorHandler): any {
	return () => {
	};
}

// Translate
import {
	TranslateModule,
	TranslateLoader,
	MissingTranslationHandler,
	MissingTranslationHandlerParams
} from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { DataSvcProvider } from '../providers/data-svc/data-svc';

export function createTranslateLoader (http: Http): any {
	return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export class MyMissingTranslationHandler implements MissingTranslationHandler {
	handle (params: MissingTranslationHandlerParams): string {
		console.warn('Missing translation', params);
		return '...';
	}
}

@NgModule({
	declarations: [
		MyApp
	],
	imports: [
		BrowserModule,
		IonicModule.forRoot(MyApp, {
			// backButtonText: ''
		}),
		IonicStorageModule.forRoot(),
		SuperTabsModule.forRoot(),
		SharedModule.forRoot(),
		TranslateModule.forRoot({
			loader: {
				provide: TranslateLoader,
				useFactory: createTranslateLoader,
				deps: [Http]
			},
			missingTranslationHandler: {
				provide: MissingTranslationHandler,
				useClass: MyMissingTranslationHandler
			}
		}),
		ProvidersModule,
		FormsModule,
		DatePickerModule,
		SwingModule
	],
	exports: [
		ProvidersModule,
		TranslateModule,
	],
	bootstrap: [IonicApp],
	entryComponents: [
		MyApp
	],
	providers: [
		HttpErrorHandler,
		{
			provide: APP_INITIALIZER,
			useFactory: createHttpErrorHandler,
			deps: [HttpErrorHandler],
			multi: true
		},
		Deeplinks,
		DataSvcProvider,
		GoogleMaps,
		InAppBrowser,
		CallNumber,
		ScreenOrientation,
		AndroidPermissions,
		Geolocation,
		OpenNativeSettings,
		NativeGeocoder,
    	Camera,
		SearchFilterServiceProvider
	]
})
export class AppModule {
}
