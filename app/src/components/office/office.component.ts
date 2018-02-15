import { Component, Input, Output, EventEmitter } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Office } from './office';

@Component({
  selector: 'office-component',
  templateUrl: './office.component.html'
})
export class ComponentOffice {
  @Input() office: Office;
  @Input() typeCard: string;
  @Output() onSelectOffice: any = new EventEmitter();

  constructor(
    public navCtrl: NavController,
  ) {}

  //go Dashboard
  goDashboard(): void{
    this.onSelectOffice.emit(this.office);
  }
}