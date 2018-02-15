import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Rx';

import { ApiGateway } from './utilities/api/api-gateway';
import { Settings } from './utilities/app-settings';

@Injectable()
export class EmployeeBenchProvider {

	constructor(
		public settings: Settings,
		public apiGateway: ApiGateway,
	) {}

    public create(data: any, hideLoader?: boolean): Observable<any> {
        let method: string = '/employeeBenches';
        return this.apiGateway.post(
            this.settings.apiEndpoint + method, {}, data, !!hideLoader
        );
    }

    public search(userId: number, name: string, hideLoader?: boolean): Observable<any> {
        let method: string = '/employeeBenches';
        let params: any = {};
        if (userId) {
            params.userId = userId;
        }
        if (name) {
            params.name = name;
        }
        return this.apiGateway.get(
            this.settings.apiEndpoint + method, params, !!hideLoader
        );
    }

    public get(id: number, hideLoader?: boolean): Observable<any> {
        let method: string = '/employeeBenches';
        return this.apiGateway.get(
            this.settings.apiEndpoint + method + '/' + id, {}, !!hideLoader
        );
    }

    public update(id: number, data: any, hideLoader?: boolean): Observable<any> {
        let method: string = '/employeeBenches';
        return this.apiGateway.put(
            this.settings.apiEndpoint + method + '/' + id, {}, data, !!hideLoader
        );
    }

    public delete(id: number, hideLoader?: boolean): Observable<any> {
        let method: string = '/employeeBenches';
        return this.apiGateway.delete(
            this.settings.apiEndpoint + method + '/' + id, {}, {}, !!hideLoader
        );
    }

    public addEmployerToBench(benchId: number, employeeId: number, hideLoader?: boolean): Observable<any> {
        let method: string = '/employeeBenches';
        return this.apiGateway.put(
            this.settings.apiEndpoint + method + '/' + benchId + '/employer/' + employeeId, {}, {}, !!hideLoader
        );
    }

    public deleteEmployerFromBench(benchId: number, employeeId: number, hideLoader?: boolean): Observable<any> {
        let method: string = '/employeeBenches';
        return this.apiGateway.delete(
            this.settings.apiEndpoint + method + '/' + benchId + '/employer/' + employeeId, {}, {}, !!hideLoader
        );
    }

}
