import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { ApiGateway } from './utilities/api/api-gateway';
import { Settings } from './utilities/app-settings';

@Injectable()
export class MessageProvider {

	constructor(
		public settings: Settings,
		public apiGateway: ApiGateway,
	) {}

    public create(data: any, hideLoader?: boolean): Observable<any> {
        let method: string = '/messages';
        return this.apiGateway.post(
            this.settings.apiEndpoint + method, {}, data, !!hideLoader
        );
    }

    public search(senderUserId: number, recipientUserId: number,
                  startDate: string, endDate: string, status: string, hideLoader?: boolean): Observable<any> {
        let method: string = '/messages';

        let params: any = {};
        if (senderUserId) {
            params.senderUserId = senderUserId;
        }
        if (recipientUserId) {
            params.recipientUserId = recipientUserId;
        }
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

    public get(hideLoader?: boolean): Observable<any> {
        let method: string = '/messages';
        return this.apiGateway.get(
            this.settings.apiEndpoint + method, {}, !!hideLoader
        );
    }

    public update(id: number, data: any, hideLoader?: boolean): Observable<any> {
        let method: string = '/messages';
        return this.apiGateway.put(
            this.settings.apiEndpoint + method + '/' + id, {}, data, !!hideLoader
        );
    }

    public delete(id: number, hideLoader?: boolean): Observable<any> {
        let method: string = '/messages';
        return this.apiGateway.delete(
            this.settings.apiEndpoint + method + '/' + id, {}, {}, !!hideLoader
        );
    }

}
