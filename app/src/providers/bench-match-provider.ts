import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { ApiGateway } from './utilities/api/api-gateway';
import { Settings } from './utilities/app-settings';

@Injectable()
export class BenchMatchProvider {

	constructor(
		public settings: Settings,
		public apiGateway: ApiGateway,
	) {}

    public get(id: number, hideLoader?: boolean): Observable<any> {
        let method: string = '/benchMatches';
        return this.apiGateway.get(
            this.settings.apiEndpoint + method + '/' + id, {}, !!hideLoader
        );
    }
    public getByUserId(userId: number, hideLoader?: boolean): Observable<any> {
        let method: string = '/benchMatches';
        return this.apiGateway.get(
            this.settings.apiEndpoint + method, { userId: userId }, !!hideLoader
        );
    }

}
