import { Injectable } from '@angular/core';
import { Platform } from 'ionic-angular';
import { Geolocation, Geoposition } from '@ionic-native/geolocation';
import { NativeGeocoder, NativeGeocoderReverseResult, NativeGeocoderForwardResult } from '@ionic-native/native-geocoder';
import { AndroidPermissions } from '@ionic-native/android-permissions';

@Injectable()
export class LocationService {

  // test
  // public fullAddress: any = "I'm new here";
  public fullAddress: any;
  public location: any;
	private isAndroid: boolean = false;
	private isCheckedOS: boolean = false;

  constructor(
    private geolocation: Geolocation,
    private nativeGeocoder: NativeGeocoder,
    private androidPermissions: AndroidPermissions,
		private platform: Platform) {
      let that: any = this;
      this.platform.ready().then((readySource) => {
        if (that.platform.is('android')) {
          that.isAndroid = true;
        }
        that.isCheckedOS = true;
        that.getCurrentLocation();
      });
  }

  getCurrentLocation(): void {
    if (!this.isCheckedOS) { return; }
    this.checkPermission();
  }

  checkPermission(): void {
    if (!this.isAndroid) {
      this.retrieveLocation();
      return;
    }
    let that: any = this;
    this.androidPermissions.checkPermission(this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION).then(
      (result: any): void => {
        if (!result.hasPermission) {
          that.getPermission();
        } else {
          that.retrieveLocation();
        }
      },
      (err: any): void => {
        that.getPermission();
      }
    );
  }

  getPermission(): void {
    let that: any = this;
    let list: any[] = [
      this.androidPermissions.PERMISSION.ACCESS_COARSE_LOCATION,
      this.androidPermissions.PERMISSION.ACCESS_FINE_LOCATION
    ];
    this.androidPermissions.requestPermissions(list).then(
      (result: any): void => {
        if (result.hasPermission) {
          that.retrieveLocation();
        }
      },
      (err: any): void => {}
    );

  }

  retrieveLocation(): void {
    let that: any = this;
    let options: any = {
        enableHighAccuracy: true
      };
    this.geolocation.getCurrentPosition(options).then((resp) => {
        console.log(resp);
        that.location = resp.coords;
        that.getcountry();
        // resp.coords.latitude
       }).catch((error) => {
         console.log('Error getting location', error);
       });
  }

  getcountry(): void {
    let that: any = this;
    this.nativeGeocoder.reverseGeocode(that.location.latitude, that.location.longitude).then(
        (result: NativeGeocoderReverseResult) => {
            that.fullAddress = result.subThoroughfare + ' ' + result.thoroughfare + ', ' + result.subLocality + ', ' + result.subAdministrativeArea + ', ' + result.countryName;
            console.log(that.fullAddress);
        })
        .catch((error: any) => console.log(error));
  }

}