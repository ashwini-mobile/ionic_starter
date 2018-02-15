import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { ApiGateway } from './utilities/api/api-gateway';
import { Settings } from './utilities/app-settings';

@Injectable()
export class EmployerSearchFilterProvider {

	constructor(
		public settings: Settings,
		public apiGateway: ApiGateway,
	) {}

    public createEmployerSearchFilter(data: any, hideLoader?: boolean): Observable<any> {
        let method: string = '/employerSearchFilters';
        return this.apiGateway.post(
            this.settings.apiEndpoint + method, {}, data, !!hideLoader
        );
    }

    public searchEmployerSearchFilters(data: any, hideLoader?: boolean): Observable<any> {
        let method: string = '/employerSearchFilters';
        return this.apiGateway.get(
            this.settings.apiEndpoint + method, {}, !!hideLoader
        );
    }

    public updateEmployerSearchFilter(data: any, hideLoader?: boolean): Observable<any> {
        let method: string = '/employerSearchFilters';
        return this.apiGateway.put(
            this.settings.apiEndpoint + method + '/' + data.id, {}, data, !!hideLoader
        );
    }

    public getEmployerSearchFilter(id: number, hideLoader?: boolean): Observable<any> {
        let method: string = '/employerSearchFilters';
        return this.apiGateway.get(
            this.settings.apiEndpoint + method + '/' + id, {}, !!hideLoader
        );
    }

    public deleteEmployerSearchFilter(id: number, hideLoader?: boolean): Observable<any> {
        let method: string = '/employerSearchFilters';
        return this.apiGateway.delete(
            this.settings.apiEndpoint + method + '/' + id, {}, !!hideLoader
        );
    }

    public searchEmployerProfiles(id: number, key: string, hideLoader?: boolean): Observable<any> {
        let method: string = '/employerSearchFilters';
        return this.apiGateway.put(
            this.settings.apiEndpoint + method + '/' + id + '/use',
			{}, !!hideLoader
        );
    }

}
