import { Component, ViewChild, NgZone, ElementRef } from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';
import {SlickCarouselComponent, SlickCarouselItem} from '../../components/slick-carousel/slick-carousel';
import { DataSvcProvider } from '../../providers/data-svc/data-svc';
import { EmployerProfileProvider } from '../../providers/employer-profile-provider';
import { UserProvider } from '../../providers/user-provider';
@IonicPage()
@Component({
	selector: 'edit-list-alert',
	templateUrl: 'edit-list-alert.html',
})
export class EditListAlert {
	@ViewChild('mainContent') mainContent: ElementRef;
	private arraySelected: any[] = [];
	private arraySelect: any[] = [];
	private typePopup: string;
	private title: string;
  constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public viewCtrl: ViewController,
		private svcService: DataSvcProvider,
		private userProvider: UserProvider,
		private employerProfileProvider: EmployerProfileProvider,
		private elementPage: ElementRef
	) {
		this.typePopup = navParams.data.typePopup;
		console.log(navParams.data.answerOptions);
		if ( this.typePopup === 'software') {
			this.title = 'Add more practice management software';
            this.arraySelect = navParams.data.answerOptions;
		} else if (this.typePopup === 'techSkill') {
			this.title = 'Add dental technology skills';
            this.arraySelect = navParams.data.answerOptions;
		} else if (this.typePopup === 'otherSoft') {
			this.title = 'Add other software skills i know and use';
            this.arraySelect = navParams.data.answerOptions;
		} else if (this.typePopup === 'generalSkill') {
			this.title = 'Add general skills i know and use';
            this.arraySelect = navParams.data.answerOptions;
		} else if (this.typePopup === 'adminSkill') {
			this.title = 'Add administrtive skills i have and excel';
            this.arraySelect = navParams.data.answerOptions;
		} else if (this.typePopup === 'dentalPhil') {
			this.title = 'Add more dental philosophy/training';
            this.arraySelect = navParams.data.answerOptions;
        } else if (this.typePopup === 'techUse') {
            this.arraySelected = navParams.data.softData.technolegies;
            this.title = 'Add dental technology skills';
            this.svcService.loadDataPopupTechSkill().then(res => {
                this.arraySelect = res;
                for (let item of this.arraySelect) {
                    for (let soft of this.arraySelected) {
                        if ( item.name === soft.name) {
                            item.isSelected = true;
                        }
                    }
                }
            });
		} else if (this.typePopup === 'dentalPhilEmplyrEdit'){
			this.arraySelected = navParams.data.softData.dentalPhil;
			this.title = 'Add dental philosophy/training';
			this.svcService.loadDataPopupDentalPhil().then(res => {
				this.arraySelect = res;
				for (let item of this.arraySelect) {
					for (let soft of this.arraySelected) {
						if ( item.name === soft.name) {
							item.isSelected = true;
						}
					}
				}
			});
		} else if (this.typePopup === 'admin') {
			//this.arraySelected = navParams.data.softData.administrators;
			this.title = 'Add Administrators';
			this.arraySelect = navParams.data.softDataEmplyrPrfle.officeManagers;
			this.arraySelect = this.arraySelect.map(d => {
						return {
						    name: d.firstName,
						    isSelected: false
						};
					});
		}else if (this.typePopup === 'position') {
			this.arraySelected = navParams.data.softData.position;
			this.title = 'Add Administrators';
			this.svcService.loadDataPopupPosition().then(res => {
				this.arraySelect = res;
				for (let item of this.arraySelect) {
					for (let soft of this.arraySelected) {
						if ( item.name === soft.name) {
							item.isSelected = true;
						}
					}
				}
			});
		}
	}
	checkSelected(): void {
		this.arraySelected = [];
		for (let item of this.arraySelect) {
			if ( item.isSelected ) {
				this.arraySelected.push(item);
			}
		}
	}
  ionViewDidEnter(): void {
		let heightIndex: number = this.mainContent.nativeElement.offsetHeight;
		this.elementPage.nativeElement.style.height = heightIndex + 119 + 'px';
  }
  // dismiss
  dismiss(): void {
	  this.viewCtrl.dismiss(this.arraySelected);
	}
	// toggle
	toogleItem(item: any): void {
		item.isSelected = !item.isSelected;
		this.checkSelected();
	}
}
