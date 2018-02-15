import { Component, ElementRef, ViewChild, NgZone } from '@angular/core';
import {IonicPage, NavController, NavParams, ViewController, Platform} from 'ionic-angular';
import { LocationService } from '../../providers/location-service';
import * as $ from 'jquery';

declare var google: any;
@IonicPage()
@Component({
	selector: 'page-map-alert',
	templateUrl: 'map-alert.html'
})
export class MapAlertPage{
	@ViewChild('mapElement') mapElement: ElementRef;
	private fullAddress: String = '';
	private map: any;
	private service: any = new google.maps.places.AutocompleteService();
	private geocoder: any = new google.maps.Geocoder();
	private listAddressFilter: any[] = [];
	private geo: any;
	private latitude: number = 0;
	private longitude: number = 0;
	private previousAddressItem: any;
	private isIos: boolean = false;
	constructor(
		public navCtrl: NavController,
		public navParams: NavParams,
		public viewCtrl: ViewController,
		private locationService: LocationService,
		private zone: NgZone,
		private platform: Platform
	) {
		let that: any = this;
        this.previousAddressItem = navParams.data.addressItem;
		this.platform.ready().then((readySource) => {
			that.isIos = that.platform.is('ios');
			if (that.isIos) {
				$('.sub-header').css('height', '69px');
				$('.search-location').css('margin-top', '31px');
				$('.group-select-address').css('top', '70px');
				$('.iclose').css('top', '41px');
				$('.i-marker').css('top', '41px');
			}
		});
	}
	ionViewDidLoad(): void {
		console.log('ionViewDidLoad ProfileAlertPage');
		this.resetLocationToDefault();
		if (this.previousAddressItem) {
			this.fullAddress = this.previousAddressItem.address;
			if (this.previousAddressItem.latitude) {
				this.latitude = this.previousAddressItem.latitude;
				this.longitude = this.previousAddressItem.longitude;
				this.updateLocation();
			}
		}
		this.loadMap();
	}
	ionViewWillEnter(): void {
		if (this.isIos) {
			$('.sub-header').css('height', '69px');
			$('.search-location').css('margin-top', '31px');
			$('.group-select-address').css('top', '70px');
			$('.iclose').css('top', '41px');
			$('.i-marker').css('top', '41px');
		}
	}
	// dismiss
	dismiss(): void {
		this.viewCtrl.dismiss({
			address: this.fullAddress,
			latitude: this.latitude,
			longitude: this.longitude
		});
	}

	chooseItem(item: any): void {
		this.geo = item;
		this.geoCode(this.geo); //convert Address to lat and long
		this.listAddressFilter = [];
	}

	//convert Address string to lat and long
	geoCode(address: any ): void {
		this.fullAddress = address.description;
		this.geocoder.geocode({'placeId': address.place_id}, (results, status) => {
			if (status === 'OK' && results[0]){
			  this.latitude = results[0].geometry.location.lat();
			  this.longitude = results[0].geometry.location.lng();
			  this.updateLocation();
			}
		});
   }

	location(): void {
		return new google.maps.LatLng(this.latitude, this.longitude);
	}

	resetLocationToDefault(): void {
		if (this.locationService.location) {
			this.fullAddress = this.locationService.fullAddress;
			this.latitude = this.locationService.location.latitude;
			this.longitude = this.locationService.location.longitude;
		} else {
			this.fullAddress = '';
			this.latitude = 39.545016;
			this.longitude = -99.983708;
		}
	}

	updateLocation(): void {
		this.map.setCenter(this.location());
	}

	moveToCurrentLocation(): void {
		this.resetLocationToDefault();
		this.map.setCenter(this.location());
	}

	updateSearchResults(): void {
		if (this.fullAddress === '') {
		  this.listAddressFilter = [];
		  return;
		}
		let that: any = this;
		this.service.getPlacePredictions({ input: this.fullAddress },
		  (predictions, status) => {
		  this.listAddressFilter = [];
		  this.zone.run(() => {
			if (predictions) {
				predictions.forEach((prediction) => {
				  this.listAddressFilter.push(prediction);
				});
			}
		  });
		});
	}

	loadMap(): void {
		let mapOptions: any = {
			center: this.location(),
			zoom: 15,
			disableDefaultUI: true,
			mapTypeId: google.maps.MapTypeId.ROADMAP
		};
		this.map = new google.maps.Map(this.mapElement.nativeElement, mapOptions);
	}
}