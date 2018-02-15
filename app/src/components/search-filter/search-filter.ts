import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { ModalController, Platform } from 'ionic-angular';
import { EmployerSearchFilterProvider } from '../../providers/employer-search-filter-provider';
import { EmployeeSearchFilterProvider } from '../../providers/employee-search-filter-provider';
import { DataSvcProvider } from '../../providers/data-svc/data-svc';
import { Dashboard } from '../../pages/dashboard/dashboard';
import { SearchFilterServiceProvider } from '../../providers/search-filter-service/search-filter-service';
import * as $ from 'jquery';

/**
 * Generated class for the SearchFilterComponent component.
 *
 * See https://angular.io/docs/ts/latest/api/core/index/ComponentMetadata-class.html
 * for more info on Angular Components.
 */
@Component({
  selector: 'search-filter',
  templateUrl: 'search-filter.html'
})
export class SearchFilterComponent {
    @Input('isShowFilterContent') isShowFilterContent: boolean = false;
    @Input('titleTabSearch') titleTabSearch: string = 'friends';
    @Input('isShowCloseBtn') isShowCloseBtn: boolean = false;

    @Output('') closeFilterView: EventEmitter<{}> = new EventEmitter();
    private selectedHighlighIndex: number = 0;
    private isIos: boolean = false;
    private deviceWidth: number = 0;
    constructor(
            private employerSearchFilterProvider: EmployerSearchFilterProvider,
            private employeeSearchFilterProvider: EmployeeSearchFilterProvider,
            private dashboardCtr: Dashboard,
            public modalCtrl: ModalController,
            private svcService: DataSvcProvider,
            private filterService: SearchFilterServiceProvider,
            private platform: Platform
    ) {
        let that: any = this;
		this.platform.ready().then((readySource) => {
            that.isIos = that.platform.is('ios');
            that.deviceWidth = that.platform.width();
		});
    }

    highlightClicked(className: string): void {
        this.selectedHighlighIndex = +className;
        if (this.filterService.listParam.length > 0) {
            this.filterService.listParam = [];
            return;
        }
        let toPos: any = $(`.text-filter-${className}`).position();
        let top: number = (+toPos.top) + $(`.text-filter-${className}`).height() + 8;
        let left: number = (+toPos.left);
        $('.listParam').css('top', `${top}px`);
        $('.listParam').css('left', `${left}px`);
        this.filterService.listParam = this.filterService.paramData[+className].data;
        let that: any = this;
        setTimeout(function(): void {
            that.adjustListParamPosition();
        }, 10);
    }
    adjustListParamPosition(): void {
        let toPos: any = $('.listParam').position();
        let width: number = +$('.listParam').width();
        let left: number = (+toPos.left);
        if (left + width + 4 > this.deviceWidth) {
            left = this.deviceWidth - width - 4;
            $('.listParam').css('left', `${left}px`);
        }

    }
	// saveCustomerFilter
	saveCustomerFilter(): void {
		if (this.filterService.getSearchFilterOnView()) {
            this.saveFilter(null).then(() => {
                this.filterService.setSearchFilterOnView(null);
                this.showSavedFilters();
            });
		} else {
            let modalAddBenches: any = this.modalCtrl.create('AddAlertPage', {
                alertTitle: 'Save Filter',
                fieldTitle: 'Filter Name',
                backBtnTitle: 'Cancel',
                saveBtnTitle: 'Save',
                backBtnHandler: () => {
                    console.log('Cancel clicked');
                },
                saveBtnHandler: data => {
                    console.log('Save clicked');
                    console.log('Field Value = ' + data);
                    this.saveFilter(data).then(() => {
                        this.showSavedFilters();
                    });
                }
            }, {cssClass: 'modal-add-alert'});
            // alertModal callback
            modalAddBenches.onDidDismiss(() => {});
            modalAddBenches.present();
        }
	}

    populateFilledValues(item: any): void {
        for (let filter of item.filter) {
            for (let group of filter.groups) {
                if (group.source === 'question') {
                    let answer: any = this.filterService.getSearchFilterOnView().answers.find(a => a.questionId === group.questionId);
                    if (answer) {
                        group.answerId = answer.id;
                        group.data.forEach(a => a.active = answer.matchingAnswerOptions.map(o => o.id).includes(a.id));
                    }
                } else if (group.source === 'occupation') {
                    group.data.filter(o => o.id === this.filterService.getSearchFilterOnView().occupationId).forEach(a => a.active = true);
                } else if (group.source === 'specialization') {
                    //group.data = this.specializations;
                }
            }
        }
    }

	search(): void {
        this.closeFilterView.emit();
	    if (this.filterService.getSearchFilterOnView() !== null && this.filterService.getSearchFilterOnView() !== undefined) {
            if (this.titleTabSearch === 'friends') {
                this.employeeSearchFilterProvider.searchEmployeeProfiles(this.filterService.getSearchFilterOnView().id, null).subscribe(response => {
                    this.filterService.setListFriends(response.items);
                    this.filterService.setListAllFriends(response.items);
                },
                error => {
                    console.log(error);
                });

            } else {
                this.employerSearchFilterProvider.searchEmployerProfiles(this.filterService.getSearchFilterOnView().id, null).subscribe(response => {
                    this.filterService.setListOpportunities(response.items);
                    this.filterService.setListAllOpportunities(response.items);
                },
                error => {
                    console.log(error);

                });
            }
        }
	}

	prepareFilter(name: any): any {
        let data: any;
        if (this.filterService.getSearchFilterOnView()) {
            data = this.filterService.getSearchFilterOnView();
            data.answers = [];
            } else {
            data = {
                name: name,
                degree: 'bachelor',
                distance: 30,
                closeTo: {
                    locality: 'Los Angeles',
                    postalCode: '111111',
                    state: 'CA'
                },
            };
            data.answers = [];
        }

        if (this.titleTabSearch !== 'friends') {
            data.employerName = 'Dental';
        }

		let filters: any = this.selectFilter();

		for (let filter of filters) {
            if (filter.filter) {
                for (let f of filter.filter) {
                    for (let group of f.groups) {
                        if (group.source === 'question') {
                            let answerIds: number[] = [];
                            group.data.filter(d => d.active).forEach(d => answerIds.push(d.id));
                            if (answerIds.length > 0) {
                                const answer: any = {
                                    // id: group.answerId,
                                    questionId: group.questionId,
                                    matchingAnswerOptions: answerIds
                                };
                                data.answers.push(answer);
                            }
                        } else if (group.source === 'occupation') {
                            let occupation: any = group.data.find(d => d.active);
                            data.occupationId = occupation.id;
                        }
                    }
                }
            }
        }
		return data;
	}

	showSavedFilters(): void {
        this.dashboardCtr.saveFilterModal = this.modalCtrl.create('SaveFilterPage', { filterTab: this.titleTabSearch }, {
            showBackdrop: false,
            cssClass: 'modal-page-filter-detail',
            enterAnimation: 'modal-transition-enter',
            leaveAnimation: 'modal-transition-leave'
        });
        this.dashboardCtr.saveFilterModal.present();
        this.dashboardCtr.isShowSaveFilter = true;
        this.dashboardCtr.saveFilterModal.onDidDismiss((data: any) => {
            this.dashboardCtr.isShowSaveFilter = false;
            this.filterService.setSearchFilterOnView(data.filterToLoad);
            this.filterService.refreshDataFilterCategory().then(() => {
                let filters: any = this.selectFilter();

                for (let item of filters) {
                    if (item.filter === undefined) {
                        this.loadFilterCategory(item).then(() => {
                            this.populateFilledValues(item);
                        });
                    } else {
                        this.populateFilledValues(item);
                    }
                }
            });
        });
	}

	saveFilter(name: string): Promise<any> {
        return new Promise((resolve: any, reject: any): any => {
            let data: any = this.prepareFilter(name);
            // console.log(JSON.stringify(data));

            if (this.filterService.getSearchFilterOnView()) {
                if (this.titleTabSearch === 'friends') {
                    this.employeeSearchFilterProvider.updateEmployeeSearchFilter(data).subscribe(response => {
                            resolve();
                        },
                        error => {
                            console.log(error);
                            reject();
                        });
                } else {
                    this.employerSearchFilterProvider.updateEmployerSearchFilter(data).subscribe(response => {
                            resolve();
                        },
                        error => {
                            console.log(error);
                            reject();
                        });
                }
            } else {
                if (this.titleTabSearch === 'friends') {
                    this.employeeSearchFilterProvider.createEmployeeSearchFilter(data).subscribe(response => {
                            resolve();
                        },
                        error => {
                            console.log(error);
                            reject();
                        });
                } else {
                    this.employerSearchFilterProvider.createEmployerSearchFilter(data).subscribe(response => {
                            resolve();
                        },
                        error => {
                            console.log(error);
                            reject();
                        });
                }
            }
        });
    }

    selectedFilterFunc(item: any): void {
        if (item.filter === undefined) {
            this.loadFilterCategory(item).then(() => {
                if (this.filterService.getSearchFilterOnView() !== null && this.filterService.getSearchFilterOnView() !== undefined) {
                    this.populateFilledValues(item);
                }
                this.showFilterPage(item);
            });
        } else {
            this.showFilterPage(item);
        }
    }

	loadFilterCategory(item: any): Promise<any> {
        return new Promise((resolve: any, reject: any): any => {
            this.svcService.loadDataByCategoryName(item.id).then(res => {
                let listFilters: any = res.data;
                for (let filter of listFilters) {
                    let cnt: number = 0;
                    for (let group of filter.groups) {
                        if (group.source === 'question') {
                            let question: any = this.filterService.getQuestions().find(q => q.text === group.key);
                            group.data = question.answerOptions;
                            group.questionId = question.id;
                        } else if (group.source === 'occupation') {
                            group.data = this.filterService.getOccupations();
                        } else if (group.source === 'specialization') {
                            group.data = this.filterService.getSpecializations();
                        }
                        group.data.map(item => {
                            item.active = false;
                        });
                        cnt += group.data.length;
                    }
                    filter.limitItem = 5;
                    filter.showMore = cnt > 5;
                }
                item.filter = listFilters;
                resolve();
            });
        });
    }

    selectFilter(): any {
        if (this.titleTabSearch === 'friends') {
            return this.filterService.getListCatFiltersFriends();
        } else {
            return this.filterService.getListCatFiltersOpp();
        }
    }

    showFilterPage(item: any): void {
        let that: any = this;
        this.dashboardCtr.filterModal = this.modalCtrl.create('FilterDetailPage', { datafilter: item }, {
            showBackdrop: false,
            cssClass: 'modal-page-filter-detail',
            enterAnimation: 'modal-transition-enter',
            leaveAnimation: 'modal-transition-leave'
        });
        this.dashboardCtr.filterModal.onDidDismiss((data: any) => {
            item.filter = data;
            that.dashboardCtr.isShowDetailFilter = false;
            that.dashboardCtr.viewFilterParamDidExit(that.dashboardCtr.profilesV);
            that.dashboardCtr.viewFilterParamDidExit(that.dashboardCtr.searchV);
        });
        this.dashboardCtr.filterModal.present();
        this.dashboardCtr.isShowDetailFilter = true;
    }

}
