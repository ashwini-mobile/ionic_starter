import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
	selector: 'page-select-use-case',
	templateUrl: 'select-use-case.html'
})
export class SelectUseCase {
	private selectedItemOne: boolean;
	private selectedItemTwo: boolean;
	private heightWindow: number;
	private entryQuestion: any;

	constructor(
		public nav: NavController,
        public navParams: NavParams,
	) {
		this.selectedItemOne = !this.selectedItemTwo;
		this.entryQuestion = navParams.get('entryQuestion');
	}

	ionViewDidLoad(): void {
		this.heightWindow = window.screen.height;
	}

	//go Page
	goBack(): void {
		this.nav.pop();
	}

	goPracticeProfile(): void {
        if (this.entryQuestion) {
            this.entryQuestion.answerOptions.forEach(a => {
                delete a.img;
                delete a.imgActive;
            });
        }

		if (this.selectedItemOne) {
			this.nav.push('EmployerProfilePage', { title: 'EmployerProfilePage', entryQuestion: this.entryQuestion });
		} else {
			this.nav.push('EmployeeProfilePage', { title: 'EmployeeProfilePage', entryQuestion: this.entryQuestion });
		}
	}

	selectedCheckOne(val: number): void {
		if (val === 1){
			this.selectedItemOne = true;
			this.selectedItemTwo = false;
		} else {
			this.selectedItemOne = false;
			this.selectedItemTwo = true;
		}
	}
}
