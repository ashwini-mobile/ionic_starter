import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { ApiGateway } from './utilities/api/api-gateway';
import { CacheRequest } from './utilities/cache-request';
import { Settings } from './utilities/app-settings';

@Injectable()
export class UserProvider {

	constructor(
		public settings: Settings,
		public apiGateway: ApiGateway,
		public cacheRequest: CacheRequest,
	) {}

	// Direct API calls
    public signup(data: any, hideLoader?: boolean): Observable<any> {
        let method: string = '/signup';
        return this.apiGateway.post(
            this.settings.apiEndpoint + method, {}, data, !!hideLoader
        );
    }

    public login(data: any, hideLoader?: boolean): Observable<any> {
        let method: string = '/login';
        return this.apiGateway.post(
            this.settings.apiEndpoint + method, {}, data, !!hideLoader
        );
    }

    public getCurrentUser(hideLoader?: boolean): Observable<any> {
        let method: string = '/currentUser';
        return this.apiGateway.get(
            this.settings.apiEndpoint + method, {}, !!hideLoader
        );
    }

    public getUsers(hideLoader?: boolean): Observable<any> {
        let method: string = '/users';
        return this.apiGateway.get(
            this.settings.apiEndpoint + method, { pageSize: 1000 }, !!hideLoader
        );
    }

    public getUsersWithBasicInfo(type: string, hideLoader?: boolean): Observable<any> {
        let method: string = '/basicUsers';
        let params: any = { pageSize: 1000 };
        if (type) {
            params.types = '["' + type + '"]';
        }

        return this.apiGateway.get(
            this.settings.apiEndpoint + method, params, !!hideLoader
        );
    }

    public get(userId: number, hideLoader?: boolean): Observable<any> {
        let method: string = '/users';
        return this.apiGateway.get(
            this.settings.apiEndpoint + method + '/' + userId, {}, !!hideLoader
        );
    }

    public getBasicInfo(userId: number, hideLoader?: boolean): Observable<any> {
        let method: string = '/users';
        return this.apiGateway.get(
            this.settings.apiEndpoint + method + '/' + userId + '/basic', {}, !!hideLoader
        );
    }

    public getFacebookPhotos(): Promise<any> {
        return new Promise((resolve: any, reject: any): any => {
            let method: string = '/user/me/facebookPhotos';
            this.cacheRequest.fetch(this.settings.apiEndpoint, method, {}, false, true).then((data: any) => {
                if (data) {
                    resolve(data);
                } else {
                    reject();
                }
            });
        });
    }

    public updateUser(userId: number, data: any, hideLoader?: boolean): Observable<any> {
        let method: string = '/users';
        return this.apiGateway.put(
            this.settings.apiEndpoint + method + '/' + userId, {}, data, !!hideLoader
        );
    }

    public updatePassword(data: any, hideLoader?: boolean): Observable<any> {
        let method: string = '/updatePassword';
        return this.apiGateway.put(
            this.settings.apiEndpoint + method, {}, data, !!hideLoader
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
