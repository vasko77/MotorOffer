import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { IntlService } from '@progress/kendo-angular-intl';
import { MotorOfferRequest } from '../models/motor-offer-request';
import { OnlineIssueService } from '../services/online-issue.service';
import { IMarka } from '../models/Marka';
import { ICover } from '../models/cover';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-offer-input',
  templateUrl: './offer-input.component.html',
  styleUrls: ['./offer-input.component.scss']
})
export class OfferInputComponent implements OnInit {

  activeTab = 1;

  offerRequest = new MotorOfferRequest();

  markes: IMarka[];
  covers: ICover[];

  private _coversAmount: number;
  get coversAmount(): number {

    let sum = 0;

    this.covers.forEach(element => {
      if (element.selected) {
        sum += element.price;
      }
    });

    return sum;
  }

  maxDateBirth: Date;

  constructor(private onlineIssueService: OnlineIssueService) {
    this.offerRequest.marka = 0;
    this.maxDateBirth = new Date();
    this.maxDateBirth.setFullYear(this.maxDateBirth.getFullYear() - 18);
  }

  ngOnInit() {

    // this.onlineIssueService.getAuthenticationInfo()
    //  .subscribe();

    this.onlineIssueService.getMarkes()
      .subscribe(data => { this.markes = data; console.log( data ); });

    this.onlineIssueService.getCovers()
      .subscribe(data => this.covers = data);
  }

  setActiveTab( tab: number ) {
    this.activeTab = tab;
  }

  validateMarka(event): boolean {
    return this.offerRequest.marka !== 0;
  }
}
