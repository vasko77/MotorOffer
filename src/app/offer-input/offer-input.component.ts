import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { IntlService } from '@progress/kendo-angular-intl';
import { MotorOfferRequest } from '../models/motor-offer-request';
import { OnlineIssueService } from '../services/online-issue.service';
import { Marka } from '../models/Marka';
import { ICover } from '../models/cover';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-offer-input',
  templateUrl: './offer-input.component.html',
  styleUrls: ['./offer-input.component.scss']
})
export class OfferInputComponent implements OnInit {

  offerRequest = new MotorOfferRequest();

  markes: Marka[];
  covers: ICover[];

  maxDateBirth: Date;

  constructor(private onlineIssueService: OnlineIssueService) {
    this.maxDateBirth = new Date();
    this.maxDateBirth.setFullYear(this.maxDateBirth.getFullYear() - 18);
  }

  ngOnInit() {

    this.onlineIssueService.getMarkes()
      .subscribe( data => this.markes = data );

      this.onlineIssueService.getCovers()
      .subscribe( data => this.covers = data );
    }

}
