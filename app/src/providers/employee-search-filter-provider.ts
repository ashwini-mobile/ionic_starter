import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { ApiGateway } from './utilities/api/api-gateway';
import { Settings } from './utilities/app-settings';

@Injectable()
export class EmployeeSearchFilterProvider {

	constructor(
		public settings: Settings,
		public apiGateway: ApiGateway,
	) {}

    public createEmployeeSearchFilter(data: any, hideLoader?: boolean): Observable<any> {
        let method: string = '/employeeSearchFilters';
        return this.apiGateway.post(
            this.settings.apiEndpoint + method, {}, data, !!hideLoader
        );
    }

    public searchEmployeeSearchFilters(name: string, hideLoader?: boolean): Observable<any> {
        let method: string = '/employeeSearchFilters';
        return this.apiGateway.get(
            this.settings.apiEndpoint + method, {}, !!hideLoader
        );
    }

    public updateEmployeeSearchFilter(data: any, hideLoader?: boolean): Observable<any> {
        let method: string = '/employeeSearchFilters';
        return this.apiGateway.put(
            this.settings.apiEndpoint + method + '/' + data.id, {}, data, !!hideLoader
        );
    }

    public getEmployeeSearchFilter(id: number, hideLoader?: boolean): Observable<any> {
        let method: string = '/employeeSearchFilters';
        return this.apiGateway.get(
            this.settings.apiEndpoint + method + '/' + id, {}, !!hideLoader
        );
    }

    public deleteEmployeeSearchFilter(id: number, hideLoader?: boolean): Observable<any> {
        let method: string = '/employeeSearchFilters';
        return this.apiGateway.delete(
            this.settings.apiEndpoint + method + '/' + id, {}, !!hideLoader
        );
    }

    public searchEmployeeProfiles(id: number, key: string, hideLoader?: boolean): Observable<any> {
        let method: string = '/employeeSearchFilters';
        return this.apiGateway.put(
            this.settings.apiEndpoint + method + '/' + id + '/use',
			{}, !!hideLoader
        );
    }

}
