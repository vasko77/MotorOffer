import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { IntlService } from '@progress/kendo-angular-intl';
import { MotorOfferRequest } from '../models/motor-offer-request';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-offer-input',
  templateUrl: './offer-input.component.html',
  styleUrls: ['./offer-input.component.scss']
})
export class OfferInputComponent implements OnInit {

  offerRequest = new MotorOfferRequest();

  maxDateBirth: Date;

  constructor() { 
    this.maxDateBirth = new Date(); 
    this.maxDateBirth.setFullYear( this.maxDateBirth.getFullYear() - 18 );
  }

  ngOnInit() {
  }

}
