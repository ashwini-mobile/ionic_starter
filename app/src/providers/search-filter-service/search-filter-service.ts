import { Injectable } from '@angular/core';
import { DataSvcProvider } from '../../providers/data-svc/data-svc';
import { LookupProvider } from '../../providers/lookup-provider';
import 'rxjs/add/operator/map';

/*
  Generated class for the SearchFilterServiceProvider provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular DI.
*/
@Injectable()
export class SearchFilterServiceProvider {

    private questions: any;
    private specializations: any;
    private occupations: any;
    public listCatFiltersFriends: any[] = [];
    public listCatFiltersOpp: any[] = [];
    private searchFilterOnView: any;
    public listFriends: any = [];
	public listFriendsUI: any = [];
    public listAllFriends: any = [];
    public listOpportunities: any = [];
	public listOpportunitiesUI: any = [];
    private listAllOpportunities: any = [];
    public listParam: any[] = [];
    public paramData: any[] = [
        {//0
            value: 'Pedodontist',
            data: [ 'Pedodontist', 'Hygienist', 'Orthodontist' ]
        },
        {//1
            value: '4-5 Years',
            data: [ '2-3 Years', '3-4 Years', '4-5 Years', '5-10 Years', '10 Years +' ]
        },
        {//2
            value: '25 miles',
            data: [ '25 miles', '50 miles', '100 miles']
        },
        {//3
            value: 'Dallas, TX',
            data: [ 'Dallas, TX', 'Oakland, CA', 'Newark, NJ']
        },
        {//4
            value: 'last month',
            data: [ 'last month', 'this month', 'next month']
        },
        {//5
            value: 'Hospital',
            data: [ 'Clinic', 'Hospital']
        },
        {//6
            value: 'Bachelor',
            data: [ 'Doctor', 'Master', 'Bachelor', 'GED', 'High School Diploma', 'Associates Degree', 'Trade School', 'Certificate Program', 'Other']
        },
        {//7
            value: 'Orthodontics',
            data: [ 'Endodontics', 'General Dentistry', 'Oral and Maxillofacial Surgery', 'Orthodontics', 'Pediatric Dentistry', 'Periodontics', 'Prostodontics' ]
        }
    ];

    constructor(
        private lookupProvider: LookupProvider,
        private svcService: DataSvcProvider
    ) {
        this.refreshDataFilterCategory().then(null);
        this.preloadFilterData();
    }
	refreshDataFilterCategory(): Promise<any> {
      return new Promise((resolve: any, reject: any): any => {
          let listCatFiltersFriends: any[] = [];
          let listCatFiltersOpp: any[] = [];
          this.svcService.loadDataFilterCategory().then(res => {
              for (let item of res) {
                  if (item.status === 'friend') {
                      listCatFiltersFriends.push(item);
                  }else {
                      listCatFiltersOpp.push(item);
                  }
              }
              this.setListCatFiltersFriends(listCatFiltersFriends);
              this.setListCatFiltersOpp(listCatFiltersOpp);
              resolve();
          });
      });
  }
    preloadFilterData(): void {
        this.lookupProvider.getQuestions('employeeProfile').then(qData => {
            this.setQuestions(qData.items);
            this.lookupProvider.getOccupations().then(oData => {
                this.setOccupations(oData.items);
                this.lookupProvider.getSpecializations().then(sData => {
                    this.setSpecializations(sData.items);
                });
            });
        });
    }
    getQuestions(): any {
        return this.questions;
    }
    setQuestions(_questions: any): void {
        this.questions = _questions;
    }
    getSpecializations(): any {
        return this.specializations;
    }
    setSpecializations(_specializations: any): void {
        this.specializations = _specializations;
        this.specializations.map(s => delete s.numInList);
    }
    getOccupations(): any {
        return this.occupations;
    }
    setOccupations(_occupations: any): void {
        this.occupations = _occupations;
        this.occupations.map(o => delete o.numInList);
    }
    getListCatFiltersFriends(): any {
        return this.listCatFiltersFriends;
    }
    setListCatFiltersFriends(_listCatFiltersFriends: any): void {
        this.listCatFiltersFriends = _listCatFiltersFriends;
    }
    getListCatFiltersOpp(): any {
        return this.listCatFiltersOpp;
    }
    setListCatFiltersOpp(_listCatFiltersOpp: any): void {
        this.listCatFiltersOpp = _listCatFiltersOpp;
    }
    getSearchFilterOnView(): any {
        return this.searchFilterOnView;
    }
    setSearchFilterOnView(_searchFilterOnView: any): void {
        this.searchFilterOnView = _searchFilterOnView;
    }
    getListFriends(): any {
        return this.listFriends;
    }
    setListFriends(_listFriends: any): void {
        this.listFriends = _listFriends;
    }
    getListAllFriends(): any {
        return this.listAllFriends;
    }
    setListAllFriends(_listAllFriends: any): void {
        this.listAllFriends = _listAllFriends;
    }
    getListOpportunities(): any {
        return this.listOpportunities;
    }
    setListOpportunities(_listOpportunities: any): void {
        this.listOpportunities = _listOpportunities;
    }
    getListAllOpportunities(): any {
        return this.listAllOpportunities;
    }
    setListAllOpportunities(_listAllOpportunities: any): void {
        this.listAllOpportunities = _listAllOpportunities;
    }
}
