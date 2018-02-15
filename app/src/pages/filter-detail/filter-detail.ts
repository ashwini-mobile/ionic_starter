import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { DataSvcProvider } from '../../providers/data-svc/data-svc';
import { LookupProvider } from '../../providers/lookup-provider';

/**
 * Generated class for the ProfileAlertPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-filter-detail',
    templateUrl: 'filter-detail.html',
})
export class FilterDetailPage {
    private questions: any;
    private occupations: any;
    private specializations: any;

    public filterData: any;
    private titleCategoryFilter: string;
    private listFilters: any[];
    private heightSet: number;

    constructor(public navCtrl: NavController,
                public navParams: NavParams,
                public viewCtrl: ViewController,
                public lookupProvider: LookupProvider,
                private svcProvider: DataSvcProvider) {
        this.titleCategoryFilter = this.navParams.data.datafilter.title;

        if (this.navParams.data.datafilter.filter !== undefined) {
            this.listFilters = this.navParams.data.datafilter.filter;
        }

        this.heightSet = window.screen.height - 118;
    }

    ionViewDidLoad(): void {
    }

    // dismiss
    dimissFunc(): void {
        for (let filter of this.listFilters) {
            filter.limitItem = 5;
        }
        this.viewCtrl.dismiss(this.listFilters);
    }

    //load more filter
    loadMoreFilter(filter: any, event: any): void{
        let limitTemp: number = 0;
        for (let group of filter.groups) {
            if (group.data.length > limitTemp) {
                limitTemp = group.data.length;
            }
        }
        filter.limitItem = limitTemp;

        event.target.classList.add('hide');
    }
}
