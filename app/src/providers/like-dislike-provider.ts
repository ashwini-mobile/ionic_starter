import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { ApiGateway } from './utilities/api/api-gateway';
import { Settings } from './utilities/app-settings';

@Injectable()
export class LikeDislikeProvider {

	constructor(
		public settings: Settings,
		public apiGateway: ApiGateway,
	) {}

    public create(data: any, hideLoader?: boolean): Observable<any> {
        let method: string = '/likeDislikes';
        return this.apiGateway.post(
            this.settings.apiEndpoint + method, {}, data, !!hideLoader
        );
    }

    public get(requestorUserId: number, targetUserId: number, hideLoader?: boolean): Observable<any> {
        let method: string = '/likeDislikes';
        let params: any = { pageSize: 1000 };
        if (requestorUserId) {
            params.requestorUserId = requestorUserId;
        }
        if (targetUserId) {
            params.targetUserId = targetUserId;
        }
        return this.apiGateway.get(
            this.settings.apiEndpoint + method, params, !!hideLoader
        );
    }

    public delete(id: number, hideLoader?: boolean): Observable<any> {
        let method: string = '/likeDislike';
        return this.apiGateway.delete(
            this.settings.apiEndpoint + method + '/' + id, {}, {}, !!hideLoader
        );
    }

    public search(requestorUserId: number,  targetUserId: number, hideLoader?: boolean): Observable<any> {
        let method: string = '/likeDislike';
        return this.apiGateway.get(
            this.settings.apiEndpoint + method, { requestorUserId: requestorUserId, targetUserId: targetUserId }, !!hideLoader
        );
    }

}
