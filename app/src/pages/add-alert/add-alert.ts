import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';

@IonicPage()
@Component({
    selector: 'page-add-alert',
    templateUrl: 'add-alert.html'
})
export class AddAlertPage {
    private alertTitle: string;
    private fieldTitle: string;
    public fieldValue: string = '';
    private backBtnTitle: string;
    private saveBtnTitle: string;
    private backBtnHandler: any;
    private saveBtnHandler: any;
    public errorField: boolean = false;

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public viewCtrl: ViewController
    ) {
        this.alertTitle = navParams.data.alertTitle;
        this.fieldTitle = navParams.data.fieldTitle;
        this.backBtnTitle = navParams.data.backBtnTitle;
        this.saveBtnTitle = navParams.data.saveBtnTitle;
        this.backBtnHandler = navParams.data.backBtnHandler;
        this.saveBtnHandler = navParams.data.saveBtnHandler;
    }

    ionViewDidLoad(): void {
        console.log('ionViewDidLoad AddAlertPage');
    }

    // save
    save(): void {
        if (this.fieldValue.trim().length === 0) {
            this.errorField = true;
            return;
        }

        this.saveBtnHandler(this.fieldValue);
        this.viewCtrl.dismiss({});
    }

    // dismiss
    dismiss(): void {
        this.backBtnHandler(this.fieldValue);
        this.viewCtrl.dismiss({});
    }
}
