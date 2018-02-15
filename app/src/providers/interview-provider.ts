import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { ApiGateway } from './utilities/api/api-gateway';
import { Settings } from './utilities/app-settings';

@Injectable()
export class InterviewProvider {

	constructor(
		public settings: Settings,
		public apiGateway: ApiGateway,
	) {}

    public create(data: any, hideLoader?: boolean): Observable<any> {
        let method: string = '/interviews';
        return this.apiGateway.post(
            this.settings.apiEndpoint + method, {}, data, !!hideLoader
        );
    }

    public search(targetUserId: number, requestorUserId: number,
                  startDate: string, endDate: string, status: string, hideLoader?: boolean): Observable<any> {
        let method: string = '/interviews';
        let params: any = {};
        if (targetUserId) {
            params.targetUserId = targetUserId;
        }
        if (requestorUserId) {
            params.requestorUserId = requestorUserId;
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
        let method: string = '/interviews';
        return this.apiGateway.get(
            this.settings.apiEndpoint + method, {}, !!hideLoader
        );
    }

    public update(id: number, data: any, hideLoader?: boolean): Observable<any> {
        let method: string = '/interviews';
        return this.apiGateway.put(
            this.settings.apiEndpoint + method + '/' + id, {}, data, !!hideLoader
        );
    }

    public delete(id: number, hideLoader?: boolean): Observable<any> {
        let method: string = '/interviews';
        return this.apiGateway.delete(
            this.settings.apiEndpoint + method + '/' + id, {}, {}, !!hideLoader
        );
    }

}
