import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { IntlService } from '@progress/kendo-angular-intl';
import { MotorOfferRequest } from '../models/motor-offer-request';
import { OnlineIssueService } from '../services/online-issue.service';
import { IMarka } from '../models/Marka';
import { ICover } from '../models/cover';
import { IMotorItem, IMotorItemsData } from '../models/online-issue-contracts/motor-item';
import { IFastQuotationResponse } from '../models/online-issue-contracts/fast-quotation-response';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-offer-input',
  templateUrl: './offer-input.component.html',
  styleUrls: ['./offer-input.component.scss']
})
export class OfferInputComponent implements OnInit {

  activeTab = 1;

  offerRequest = new MotorOfferRequest();

  markesData: IMotorItemsData;
  quotationResponse: IFastQuotationResponse;
  // covers: ICover[];

  // private : number;
  get coversAmount12(): number {
    return this.calculateSum( 0 );
  }

  // private _coversAmount6: number;
  get coversAmount6(): number {
    return this.calculateSum( 1 );
  }

  // private _coversAmount3: number;
  get coversAmount3(): number {
    return this.calculateSum( 2 );
  }

  maxDateBirth: Date;

  constructor(private onlineIssueService: OnlineIssueService) {
    this.offerRequest.marka = 0;
    this.maxDateBirth = new Date();
    this.maxDateBirth.setFullYear(this.maxDateBirth.getFullYear() - 18);
  }


  private calculateSum( duration: number ): number {
    let sum = 0;

    // tslint:disable-next-line:max-line-length
     if (this.quotationResponse && this.quotationResponse.CalculatedQuotationsResult[0]) {
     this.quotationResponse.CalculatedQuotationsResult[0].Covers.forEach(element => {
       // console.log( JSON.stringify( element ));
       if (element.Selected) {
         sum += element.CoverPremia[duration].CoverPremium;
       }
     });
    }

   return sum;
  }

  ngOnInit() {

    // this.onlineIssueService.getAuthenticationInfo()
    //  .subscribe();

    this.onlineIssueService.getMarkes()
      .subscribe(
        (data: IMotorItemsData) => { this.markesData = data; console.log('ParamData Data: ' + JSON.stringify(this.markesData)); },
        (err: any) => { console.error('Component log: ' + JSON.stringify(err)); }
      );

    this.onlineIssueService.getInitialQuotation()
      .subscribe(
        // tslint:disable-next-line:max-line-length
        (data: IFastQuotationResponse) => { this.quotationResponse = data; console.log('Component Data: ' + JSON.stringify(this.quotationResponse)); },
        (err: any) => { console.error('Component log: ' + JSON.stringify(err)); }
      );

    // this.onlineIssueService.getCovers()
    //   .subscribe(data => this.covers = data);
  }

  setActiveTab(tab: number) {
    this.activeTab = tab;
  }

  validateMarka(event): boolean {
    return this.offerRequest.marka !== 0;
  }
}
