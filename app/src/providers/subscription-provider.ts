import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { ApiGateway } from './utilities/api/api-gateway';
import { CacheRequest } from './utilities/cache-request';
import { Settings } from './utilities/app-settings';

@Injectable()
export class SubscriptionProvider {

	constructor(
		public settings: Settings,
		public apiGateway: ApiGateway,
		public cacheRequest: CacheRequest,
	) {}

	public getSubscriptions(): Observable<any> {
		let method: string = '/subscriptions';
		return this.apiGateway.get(
		    this.settings.apiEndpoint + method, {}
		);
	}

}
