import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { DataSvcProvider } from '../../providers/data-svc/data-svc';
import { EmployeeSearchFilterProvider } from '../../providers/employee-search-filter-provider';
import { EmployerSearchFilterProvider } from '../../providers/employer-search-filter-provider';

/**
 * Generated class for the ProfileAlertPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-save-filter',
    templateUrl: 'save-filter.html',
})
export class SaveFilterPage {

    private filterTab: string;

    private filterData: any;

    //public filterData: any;
    //private titleCategoryFilter: string;
    //private listFilters: any[];
    private heighSet: number;

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public viewCtrl: ViewController,
                private employerSearchFilterProvider: EmployerSearchFilterProvider,
                private employeeSearchFilterProvider: EmployeeSearchFilterProvider,
                private svcProvider: DataSvcProvider) {

        this.filterTab = this.navParams.data.filterTab;
    }

    ionViewDidLoad(): void {
        if (this.filterTab === 'friends') {
            this.employeeSearchFilterProvider.searchEmployeeSearchFilters(null).subscribe(response => {
                    this.filterData = response.items;
                },
                error => {
                    console.log(error);
                });
        } else {
            this.employerSearchFilterProvider.searchEmployerSearchFilters(null).subscribe(response => {
                    this.filterData = response.items;
                },
                error => {
                    console.log(error);
                });
        }
    }

    // Load search filter
    loadSearchFilter(item: any): void {
        this.viewCtrl.dismiss({
            filterToLoad: item
        });
    }

    // dismiss
    dimissFunc(): void {
        this.viewCtrl.dismiss();
    }

}
