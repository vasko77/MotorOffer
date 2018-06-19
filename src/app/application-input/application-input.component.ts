import { Component, OnInit } from '@angular/core';
import { IApplicationInputParams } from '../models/application-input-params';
import { Subscription } from 'rxjs/internal/Subscription';

@Component({
  templateUrl: './application-input.component.html',
  styleUrls: ['./application-input.component.scss']
})
export class ApplicationInputComponent implements OnInit {

  mouseOverSubmit: boolean;
  busy: Subscription;

  applicationInput: IApplicationInputParams;

  constructor() {
    this.applicationInput = {
      firstName: '',
      lastName: '',
      fatherName: '',
      address: '',
      city: '',
      eMail: '',
      phone1: '',
      phone2: '',
      profession: '',
      sex: 0,
      taxNumber: '',
      taxOffice: '',
      zip: ''
    };
   }

  ngOnInit() {
  }

  saveProposal(): void {
  }

}
