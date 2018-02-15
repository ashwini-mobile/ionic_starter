import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { ApiGateway } from './utilities/api/api-gateway';
import { Settings } from './utilities/app-settings';

@Injectable()
export class ContactUsProvider {

	constructor(
		public settings: Settings,
		public apiGateway: ApiGateway,
	) {}

    public create(data: any, hideLoader?: boolean): Observable<any> {
        let method: string = '/contactUsMessages';
        return this.apiGateway.post(
            this.settings.apiEndpoint + method, {}, data, !!hideLoader
        );
    }

    public search(startDate: string, endDate: string, status: string, hideLoader?: boolean): Observable<any> {
        let method: string = '/contactUsMessages';
        let params: any = {};
        if (startDate) {
            params.startDate = startDate;
        }
        if (endDate) {
            params.endDate = endDate;
        }
        if (status) {
            params.status = status;
        }
        return this.apiGateway.get(
            this.settings.apiEndpoint + method, params, !!hideLoader
        );
    }

}
