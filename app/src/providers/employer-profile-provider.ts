import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { ApiGateway } from './utilities/api/api-gateway';
import { CacheRequest } from './utilities/cache-request';
import { Settings } from './utilities/app-settings';

@Injectable()
export class EmployerProfileProvider {

	constructor(
		public settings: Settings,
		public apiGateway: ApiGateway,
		public cacheRequest: CacheRequest,
	) {}

	// Direct API calls
    public createEmployerProfile(data: any, hideLoader?: boolean): Observable<any> {
        let method: string = '/employerProfiles';
        return this.apiGateway.post(
            this.settings.apiEndpoint + method, {}, data, !!hideLoader
        );
    }

    public getEmployerProfileByUserId(userId: number, hideLoader?: boolean): Observable<any> {
        let method: string = '/employerProfiles';
        return this.apiGateway.get(
            this.settings.apiEndpoint + method, { userId: userId }, !!hideLoader
        );
    }

    public getEmployerProfile(profileId: number, hideLoader?: boolean): Observable<any> {
        let method: string = '/employerProfiles';
        return this.apiGateway.get(
            this.settings.apiEndpoint + method + '/' + profileId, {}, !!hideLoader
        );
    }

    public updateEmployerProfile(data: any, hideLoader?: boolean): Observable<any> {
        let method: string = '/employerProfiles';
        return this.apiGateway.put(
            this.settings.apiEndpoint + method + '/' + data.id, {}, data, !!hideLoader
        );
    }

    public getData(hideLoader?: boolean): Observable<any> {
		let method: string = 'data.get';
		return this.apiGateway.get(
			this.settings.apiEndpoint + method, {}, !!hideLoader
		);
	}
	public postData(post_data: any, hideLoader?: boolean): Observable<any> {
		let method: string = 'data.post';
		return this.apiGateway.post(
			this.settings.apiEndpoint + method, {}, post_data, !!hideLoader
		);
	}

	// Cache API calls
	public fetch(): Promise<any> {
		return new Promise((resolve: any, reject: any): any => {
			let method: string = 'data.get';
			this.cacheRequest.fetch(this.settings.apiEndpoint, method, false).then((data: any) => {
				if (data) {
					resolve(data);
				} else {
					reject();
				}
			});
		});
	}
}
