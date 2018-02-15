/***************************************************
 * App settings for API, S3, GoogleAnalytics, etc. *
 ***************************************************/

import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';

@Injectable()
export class Settings {

	constructor(
		private platform: Platform,
	) {}

	private readonly baseUrl: string = (
		this.platform.is('cordova')
            ? 'http://mhykol-mjolnir-backend.herokuapp.com'
            : 'http://mhykol-mjolnir-backend.herokuapp.com'
            // ? 'http://localhost:3000'
            // : 'http://localhost:3000'
	);

	private readonly baseLessonUrl: string = (
		this.platform.is('cordova')
		? 'https://ti-vragenlijst.e-dev.nl'
		: 'https://ti-vragenlijst.e-dev.nl'
	);

	public readonly apiEndpoint: string = this.baseUrl + '/api/v1';
	public readonly apiLessonEndpoint: string = this.baseLessonUrl + '/api/index.cfm?act=';
	public readonly imgBaseEndpoint: string = '';
	public readonly imgBasePath: string = '';
	public readonly oAuth: any = {
		consumer: {
			key: '',
			secret: ''
		},
		signatureMethod: 'HMAC-SHA1',
		version: '1.0'
	};
	public readonly imgEndpoint: string = '';
	public readonly videoEndpoint: string = '';
	public readonly fileEndpoint: string = '';
	public readonly s3: any = {
		endpoint: '',
		accesskey: ''
	};
	public readonly gaId: string = '';
}
