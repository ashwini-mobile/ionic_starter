import { Injectable } from '@angular/core';
import { CacheRequest } from './utilities/cache-request';
import { Settings } from './utilities/app-settings';

@Injectable()
export class LookupProvider {

	constructor(
		public settings: Settings,
		public cacheRequest: CacheRequest,
	) {}

	// Cache API calls
	public getSpecializations(): Promise<any> {
		return new Promise((resolve: any, reject: any): any => {
			let method: string = '/specializations';
			this.cacheRequest.fetch(this.settings.apiEndpoint, method, { pageSize: 100, pageIndex: 0 }, false, true).then((data: any) => {
				if (data) {
					resolve(data);
				} else {
					reject();
				}
			});
		});
	}

    public getOccupations(): Promise<any> {
        return new Promise((resolve: any, reject: any): any => {
            let method: string = '/occupations';
            this.cacheRequest.fetch(this.settings.apiEndpoint, method, { pageSize: 100, pageIndex: 0 }, false, true).then((data: any) => {
                if (data) {
                    resolve(data);
                } else {
                    reject();
                }
            });
        });
    }

    public getQuestions(type: string): Promise<any> {
        return new Promise((resolve: any, reject: any): any => {
            let method: string = '/questions';
            this.cacheRequest.fetch(this.settings.apiEndpoint, method, { type: type }, false, true).then((data: any) => {
                if (data) {
                    resolve(data);
                } else {
                    reject();
                }
            });
        });
    }

}
