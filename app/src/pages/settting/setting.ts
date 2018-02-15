import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController } from 'ionic-angular';


@IonicPage()
@Component({
	selector: 'page-setting',
	templateUrl: 'setting.html'
})
export class Setting {
	constructor(
		public nav: NavController
	) {
	}

	goBack(): void{
		this.nav.pop();
	}
}
