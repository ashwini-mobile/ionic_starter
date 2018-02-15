import {Component, ElementRef, ViewChild, AfterViewInit} from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController} from 'ionic-angular';

/**
 * Generated class for the ProfileAlertPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-notification-connect-alert',
    templateUrl: 'notification-connect-alert.html',
})
export class NotificationConnectAlert implements AfterViewInit {
    @ViewChild('mainContent') mainContent: ElementRef;
    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public viewCtrl: ViewController,
        private elmentModal: ElementRef
    ) {}
    ionViewDidLoad(): void {
        console.log('ionViewDidLoad NotificationAlertPage');
    }
    // dismiss
    dismiss(): void {
        this.viewCtrl.dismiss();
    }
    ngAfterViewInit(): void {
        console.log(this.elmentModal.nativeElement.parentElement);
        // let heightSet: number = this.mainContent.nativeElement.offsetHeight;
        // this.elmentModal.nativeElement.parent().parent().style.height = heightSet + 'px';
    }
}
