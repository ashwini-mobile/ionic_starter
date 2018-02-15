import { Component } from '@angular/core';
import { IonicPage, NavController, Platform } from 'ionic-angular';
import { DataSvcProvider } from '../../providers/data-svc/data-svc';
import { LookupProvider } from '../../providers/lookup-provider';
import * as $ from 'jquery';

@IonicPage()
@Component({
	selector: 'page-hear-about-us',
	templateUrl: 'hear-about-us.html',
	providers: [DataSvcProvider]
})
export class HearAboutUs {
	private arrayData: any;
	private selectOther: boolean;
	private heightWindow: number;
	private question: any;
	private answerOptions: any = [];
	private other: string;
	private entryQuestion: any;
	private isAndroid: boolean = false;

	constructor(
		public nav: NavController,
        public lookupProvider: LookupProvider,
		public dataSvcProvider: DataSvcProvider,
		private platform: Platform
	) {
		this.loadDataJson();
		this.selectOther = false;

		let that: any = this;
		this.platform.ready().then((readySource) => {
			if (that.platform.is('android')) {
				that.isAndroid = true;
				window.addEventListener('native.keyboardshow', that.keyboardWillShowHandler);
				window.addEventListener('native.keyboardhide', that.keyboardWillHideHandler);
			}
		});
	}

	keyboardWillShowHandler(e: any): void {
		$('.aboutus-page').animate({bottom: '100%'}, 100);
	}

	keyboardWillHideHandler(e: any): void {
		$('.aboutus-page').animate({bottom: 0}, 100);
	}

	ionViewDidLoad(): void {
		this.heightWindow = window.screen.height;
	}

	ionViewDidEnter(): void {
		if (this.question && !this.question.answerOptions[0].img) {
			this.populateQuestion();
		}
	}

	// load data json
    loadDataJson(): void {
        this.dataSvcProvider.loadHearAboutUs()
            .then(data => {
                this.arrayData = data;
                this.loadQuestions();
            });
    }

    loadQuestions(): void {
        this.lookupProvider.getQuestions('entry').then(data => {
			this.entryQuestion = data;
			this.populateQuestion();
        });
    }

    populateQuestion(): void {
		let qStr: string = 'Just curious. How did you hear about us ?';
		this.question = this.entryQuestion.items.find(q => q.text === qStr);
		this.question.answerOptions.forEach(a => {
			let staticItem: any = this.arrayData.find(si => si.name === a.value);
			if (staticItem) {
				a.img = staticItem.img;
				a.imgActive = staticItem.imgActive;
			}
		});
		this.answerOptions = this.question.answerOptions;
	}

	// select item
	selectFunc(i: number): void {
		if (this.question.answerOptions[i].value === 'Other'){
			this.selectOther = !this.selectOther;
			this.question.otherAnswer = this.selectOther ? this.other : '';
			if (this.isAndroid) {
				if (this.selectOther) {
					// $('.bottom-button').css('margin-top', '10px');
					$('.btn-bottom').css('margin-top', '-20px');
				} else {
					// $('.bottom-button').css('margin-top', '30px');
					$('.btn-bottom').css('margin-top', '0');
				}
			}
		}
        this.question.answerOptions[i].isActive = !this.question.answerOptions[i].isActive;
	}

	goSelectUseCase(): void {
		if (this.question) {
			let selected: any = this.question.answerOptions.find(a => a.isActive);
			if (selected) {
                this.nav.push('SelectUseCase', { title: 'SelectUseCase', entryQuestion: this.question });
			}
		}
	}

	goBack(): void {
		this.nav.pop();
	}

}
