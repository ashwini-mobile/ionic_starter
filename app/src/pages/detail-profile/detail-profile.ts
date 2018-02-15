import { Component, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController, ModalController, ActionSheetController } from 'ionic-angular';
import { DataSvcProvider } from '../../providers/data-svc/data-svc';
import { EmployerProfileProvider } from '../../providers/employer-profile-provider';
import { EmployerProfile } from '../../models/employer-profile';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { CallNumber } from '@ionic-native/call-number';
declare var google: any;
/**
 * Generated class for the ProfileAlertPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */

@IonicPage()
@Component({
    selector: 'page-detail-profile',
    templateUrl: 'detail-profile.html'
})
export class DetailProfilePage implements OnInit {
    private dataProfileDetail: any;
    private dataChart: any;
    private isSubcription: boolean = false;
    private isShowVMInternal: boolean = false;
	private isShowVMExternal: boolean = false;
    @ViewChild('mapElement') mapElement: ElementRef;
    private map: any;

    private employerProfile: any = new EmployerProfile();

    constructor(
        public navCtrl: NavController,
        public navParams: NavParams,
        public viewCtrl: ViewController,
        private employerProfileProvider: EmployerProfileProvider,
        private svcService: DataSvcProvider,
        private modal: ModalController,
		public actionSheetCtrl: ActionSheetController,
		private iab: InAppBrowser,
		private callNumber: CallNumber
    ) {
    }
    ngOnInit(): void {
        this.svcService.loadProfileDetail().then(res => {
            this.dataProfileDetail = res;
            this.svcService.getSubcriptions().then(res => {
                // this.loadMap();
                for (let item of res) {
                    if (this.dataProfileDetail.subcriptionID === item.id) {
                        this.dataProfileDetail.subcription = item;
                    }
                }

                const userId: number = this.navParams.data.userId || this.navParams.data.employer.id;
                this.employerProfileProvider.getEmployerProfileByUserId(userId)
                    .subscribe(response => {
                            this.employerProfile = response;

                            this.loadMap();
                            for (let item of res) {
                                if (this.dataProfileDetail.subcriptionID === item.id) {
                                    this.dataProfileDetail.subcription = item;
                                }
                            }

                            this.convertDataToChart(this.employerProfile.employeeOrganization);
                        },
                        error => {
                            console.log('Error in retrieving employer profile');
                            console.log(error);
                        });
            });
        });
        this.svcService.loadDataChart().then(res => {
            this.dataChart = res;
        });
        this.svcService.getSubcriptionVariable().then(res => {
            this.isSubcription = res;
        });
    }

    convertDataToChart(org: any): void {
        this.dataChart.orgId = org.id;
        this.dataChart.id = org.root.id;
        this.dataChart.name = org.root.title;
        this.dataChart.branches = [];
        org.root.children.forEach(b => {
            const branch: any = {
                id: b.id,
                name: b.title,
                sections: [],
            };
            b.children.forEach(s => {
                if (s.title !== null) {
                    const section: any = {
                        id: s.id,
                        name: s.title,
                        groups: [],
                    };
                    s.children.forEach(g => {
                        if (g.title !== null) {
                            section.groups.push({
                                id: g.id,
                                name: g.title,
                            });
                        }
                    });
                    branch.sections.push(section);
                }
            });
            this.dataChart.branches.push(branch);
        });
    }

    // dismiss
    dismiss(): void {
        this.viewCtrl.dismiss();
    }

    openURL(url: any): void {
	const browser: any = this.iab.create('http://www.' + url, '_system', 'location=no');
    }

    callThePerson(contactNo: any): void {
		if (contactNo) {
			this.callNumber.callNumber(contactNo, false);
		}
	}

    showModalShareFunc(): void {
		// let modalShareProfile: any = this.modal.create('ShareAlert', {}, { showBackdrop: true, cssClass: 'modal-share-profile' });
        // modalShareProfile.present();
        let actionSheet: any = this.actionSheetCtrl.create({
			title: 'Tap to Share',
			buttons: [
				{
					text: 'Destructive',
					role: 'destructive',
					handler: () => {
						console.log('Destructive clicked');
					}
				},
				{
					text: 'Archive',
					handler: () => {
						console.log('Archive clicked');
					}
				},
				{
					text: 'Cancel',
					role: 'cancel',
					handler: () => {
						console.log('Cancel clicked');
					}
				}
			]
		});
		actionSheet.present();
    }
    loadMap(): void {
        let latLng: any = new google.maps.LatLng(this.dataProfileDetail.geo.lat, this.dataProfileDetail.geo.long);
        let mapOptions: any = {
            center: latLng,
            zoom: 15,
            disableDefaultUI: true,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
        let marker: any = new google.maps.Marker({
            position: latLng,
            map: this.map,
            icon: 'assets/img/marker.png'
        });
    }
}
