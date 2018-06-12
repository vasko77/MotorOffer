import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { IntlService } from '@progress/kendo-angular-intl';
import { IQuotationRequest } from '../models/online-issue-contracts/quotation-request';
import { IMotorItem, IMotorItemsData } from '../models/online-issue-contracts/motor-item';
import { ToastrService } from 'ngx-toastr';
import { IQuotationResponse, ICover, ICalculatedQuotationsResult, IError } from '../models/online-issue-contracts/quotation-response';
import { OnlineIssueService } from '../services/online-issue.service';
import { QuotationInputParams } from '../models/quotation-input-params';
import { ICoversResponse, ICoverItem } from '../models/online-issue-contracts/covers-response';
import { Subscription } from 'rxjs';
import { ErrorInfo } from '../models/errorInfo';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-offer-input',
  templateUrl: './offer-input.component.html',
  styleUrls: ['./offer-input.component.scss']
})
export class OfferInputComponent implements OnInit {

  busyMarkes: Subscription;
  busyQuotations: Subscription;

  quotationInput = new QuotationInputParams();
  mouseOverSubmit: boolean;
  activeTab = 1;

  markesData: IMotorItemsData;
  quotationResult: ICalculatedQuotationsResult;
  covers: ICover[];
  coverItems: ICoverItem[];
  errors: IError[];

  get coversAmount12(): number {
    return this.calculateSum(0);
  }

  get coversAmount6(): number {
    return this.calculateSum(1);
  }

  get coversAmount3(): number {
    return this.calculateSum(2);
  }

  maxDateBirth: Date;

  constructor(private onlineIssueService: OnlineIssueService,
    private toastr: ToastrService) {

    this.quotationInput.markaCode = 0;
    this.maxDateBirth = new Date();
    this.maxDateBirth.setFullYear(this.maxDateBirth.getFullYear() - 18);
  }


  private calculateSum(duration: number): number {
    let sum = 0;

    if (this.covers) {
      this.covers.forEach(element => {
        // console.log( JSON.stringify( element ));
        if (element.Selected && element.CoverPremia.length >= duration) {
          sum += element.CoverPremia[duration].CoverPremium;
        }
      });
    }

    return sum;
  }

  ngOnInit() {

    // this.onlineIssueService.getAuthenticationInfo()
    //  .subscribe();

    setTimeout(() => this.toastr.info('Kisses', 'Hi there'));

    this.busyMarkes = this.onlineIssueService.getMarkes()
      .subscribe(
        (data: IMotorItemsData) => { this.markesData = data; },
        (err: any) => {
          console.error('Component log: ' + JSON.stringify(err));
          setTimeout(() => this.toastr.error(err.friendlyMessage, 'Σφάλμα'));
        }
      );

    this.busyQuotations = this.onlineIssueService.getPackageCovers()
      .subscribe(
        (data: ICoversResponse) => {
          this.coverItems = data.CoversCollection[0].CoverItem;
          // console.log('Covers Data: ' + JSON.stringify(data));
        },
        (err: ErrorInfo) => {
          console.error('Component log: ' + JSON.stringify(err));
          setTimeout(() => this.toastr.error(err.friendlyMessage, 'Σφάλμα'));
        }
      );
  }


  quotation(): void {

    console.log(JSON.stringify(this.quotationInput));

    const quotationRerquest: IQuotationRequest = {
      Header: {
        CultureName: 'GR',
        ServiceVersion: '1'
      },
      motorQuotationParams: {
        MotorInsurancePackage: 'SP7',
        InsuranceStartDate: this.quotationInput.contractStartDate.toISOString().split('T')[0],
        MainDriverInfo: {
          BirthDate: this.quotationInput.birthDate.toISOString().split('T')[0],
          LicenseDate: `${this.quotationInput.driverLicenseYear}-01-01`,
          PostalCode: this.quotationInput.zip
        },
        VehicleInfo: {
          PlateNumber: this.quotationInput.plateNo,
          AssemblyDate: `${this.quotationInput.vehicleLicenseYear}-01-01`,
          PurchaseDate: `${this.quotationInput.vehicleLicenseYear}-01-01`,
          CC: this.quotationInput.cc.toString(),
          EurotaxBrandCode: this.quotationInput.markaCode,
          EurotaxModelCode: 0,
          EurotaxModelGroupCode: 0,
          HasAlarmImmobilizer: false,
          IsKeptInGarage: false,
          UsageType: '00',
          VehicleValue: this.quotationInput.vehicleValue
        },
        MotorCovers: [
        ],
        MotorDiscounts: [
          ],
        OtherDrivers: [
        ]
      }
    };

    if ( this.quotationInput.youngestDriverBirthDate ) {
      quotationRerquest.motorQuotationParams.OtherDrivers.push( {
        BirthDate: this.quotationInput.youngestDriverBirthDate.toISOString().split('T')[0],
        LicenseDate: `${this.quotationInput.youngestDriverLicenseYear}-01-01`,
        TypeOfDriver: 2
      });
    }

    if ( this.quotationInput.oldestDriverBirthDate ) {
      quotationRerquest.motorQuotationParams.OtherDrivers.push( {
        BirthDate: this.quotationInput.oldestDriverBirthDate.toISOString().split('T')[0],
        LicenseDate: `${this.quotationInput.oldestDriverLicenseYear}-01-01`,
        TypeOfDriver: 3
      });
    }

    console.log(JSON.stringify(quotationRerquest));

    this.onlineIssueService.getInitialQuotation(quotationRerquest)
      .subscribe(
        (data: IQuotationResponse) => {

          this.quotationResult = data.CalculatedQuotationsResult[0];
          console.log('quotationResult Data: ' + JSON.stringify(this.quotationResult));

          if (this.quotationResult) {

            if (this.quotationResult.Allow) {

              this.covers = this.quotationResult.Covers
                .filter((cover: ICover) => { if (cover.Allowed) { return cover; } })
                .sort((c1: ICover, c2: ICover) => c1.VisibilityOrder - c2.VisibilityOrder);

            } else {

              this.errors = this.quotationResult.Errors;

            }

          } else {

            this.covers = [];

          }
        },
        (err: ErrorInfo) => {
          console.error('Component log: ' + JSON.stringify(err));
          this.toastr.error(err.friendlyMessage, 'Σφάλμα');
        }
      );
  }

  setActiveTab(tab: number) {
    this.activeTab = tab;
  }

  validateMarka(event): boolean {
    return this.quotationInput.markaCode !== 0;
  }
}
