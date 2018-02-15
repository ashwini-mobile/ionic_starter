import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { ApiGateway } from './utilities/api/api-gateway';
import { Settings } from './utilities/app-settings';

@Injectable()
export class SuggestionProvider {

	constructor(
		public settings: Settings,
		public apiGateway: ApiGateway,
	) {}

    public create(data: any, hideLoader?: boolean): Observable<any> {
        let method: string = '/suggestionRequests';
        return this.apiGateway.post(
            this.settings.apiEndpoint + method, {}, data, !!hideLoader
        );
    }

    public search(hideLoader?: boolean): Observable<any> {
        let method: string = '/suggestionRequests';
        let params: any = {};
        return this.apiGateway.get(
            this.settings.apiEndpoint + method, params, !!hideLoader
        );
    }

}
