import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { IQuotationRequest } from '../models/online-issue-contracts/quotation-request';
import { IMotorItemsData } from '../models/online-issue-contracts/motor-item';
import { ToastrService } from 'ngx-toastr';
import { IQuotationResponse, ICover, ICalculatedQuotationsResult, IError } from '../models/online-issue-contracts/quotation-response';
import { OnlineIssueService } from '../services/online-issue.service';
import { QuotationInputParams } from '../models/quotation-input-params';
import { ICoversResponse, ICoverItem } from '../models/online-issue-contracts/covers-response';
import { Subscription } from 'rxjs';
import { ErrorInfo } from '../models/errorInfo';
import { MvpApiService } from '../services/mvp-api.service';
import { IQuotationInfo } from '../models/mvp-contracts/quotation-info';
import { AuthenticationService } from '../services/authentication.service';
import { IAuthentication } from '../models/authentication';

@Component({
  encapsulation: ViewEncapsulation.None,
  selector: 'app-offer-input',
  templateUrl: './offer-input.component.html',
  styleUrls: ['./offer-input.component.scss']
})
export class OfferInputComponent implements OnInit {

  busyMarkes: Subscription;
  busyQuotations: Subscription;

  authenticationInfo: IAuthentication;
  efginsUser: boolean;

  quotationInput = new QuotationInputParams();
  mouseOverSubmit: boolean;
  activeTab = 1;
  duration = '12';

  markesData: IMotorItemsData;
  quotationResult: ICalculatedQuotationsResult;
  covers: ICover[];
  packageCoverItems: ICoverItem[];
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
    private mvpApiService: MvpApiService,
    private toastr: ToastrService,
    private authenticationService: AuthenticationService) {

    this.quotationInput.markaCode = 0;
    this.maxDateBirth = new Date();
    this.maxDateBirth.setFullYear(this.maxDateBirth.getFullYear() - 18);
  }


  private calculateSum(duration: number): number {
    let sum = 0;

    if (this.covers) {
      this.covers.forEach(element => {
        // console.log( JSON.stringify( element ));
        if (element.Selected && element.CoverPremia.length >= duration && element.CoverPremia[duration]) {
          sum += element.CoverPremia[duration].CoverPremium;
        }
      });
    }

    return sum;
  }

  ngOnInit() {

    this.authenticationService.getAuthenticationInfo()
      .subscribe(
        (data: IAuthentication) => {
          console.log(data);
          this.authenticationInfo = data;
          this.efginsUser = data.efginsUser;
        },
        (err: any) => {
          console.error('Component log: ' + JSON.stringify(err));
          setTimeout(() => this.toastr.error(err.friendlyMessage, 'Σφάλμα'));
        }
      );

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
          this.packageCoverItems = data.CoversCollection[0].CoverItem;
          console.log( 'Covers Data' );
          console.log( this.packageCoverItems );
        },
        (err: ErrorInfo) => {
          console.error('Component log: ' + JSON.stringify(err));
          setTimeout(() => this.toastr.error(err.friendlyMessage, 'Σφάλμα'));
        }
      );
  }

  loadQuotationInfo(): void {
    if (!this.quotationInput.plateNo) {
      return;
    }

    this.mvpApiService.getQuotation(this.quotationInput.plateNo)
      .subscribe(
        (quot: IQuotationInfo) => {
          this.quotationInput.markaCode = quot.MarkaCode;
          this.quotationInput.birthDate = new Date(quot.BirthDate);
          this.quotationInput.cc = quot.CC;
          this.quotationInput.contractStartDate = new Date(quot.ContractStartDate);
          this.quotationInput.county = quot.County;
          this.quotationInput.driverLicenseYear = quot.LicenseYear;
          if (quot.OldestDriverBirthDate) {
            this.quotationInput.oldestDriverBirthDate = new Date(quot.OldestDriverBirthDate);
          }
          this.quotationInput.oldestDriverLicenseYear = quot.OldestDriverLicenseYear;
          this.quotationInput.vehicleLicenseYear = quot.VehicleLicenseYear;
          this.quotationInput.vehicleValue = quot.VehicleValue;
          if (quot.YoungestDriverBirthDate) {
            this.quotationInput.youngestDriverBirthDate = new Date(quot.YoungestDriverBirthDate);
          }
          this.quotationInput.youngestDriverLicenseYear = quot.YoungestDriverLicenseYear;
          this.quotationInput.zip = quot.Zip;
        },
        (err: ErrorInfo) => { console.log('Plate not found'); }
      );
  }

  quotation(): void {

    // Prepare quotation request

    const quotationRerquest: IQuotationRequest = {
      Header: {
        CultureName: 'GR',
        ServiceVersion: '1'
      },
      motorQuotationParams: {
        MotorInsurancePackage: 'MVP',
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

    if (this.quotationInput.youngestDriverBirthDate) {
      quotationRerquest.motorQuotationParams.OtherDrivers.push({
        BirthDate: this.quotationInput.youngestDriverBirthDate.toISOString().split('T')[0],
        LicenseDate: `${this.quotationInput.youngestDriverLicenseYear}-01-01`,
        TypeOfDriver: 2
      });
    }

    if (this.quotationInput.oldestDriverBirthDate) {
      quotationRerquest.motorQuotationParams.OtherDrivers.push({
        BirthDate: this.quotationInput.oldestDriverBirthDate.toISOString().split('T')[0],
        LicenseDate: `${this.quotationInput.oldestDriverLicenseYear}-01-01`,
        TypeOfDriver: 3
      });
    }

    if (this.quotationInput.publicServant) {
      quotationRerquest.motorQuotationParams.MotorDiscounts.push({ MotorDiscountItem: 2, Selected: true });
    }
    if (this.quotationInput.uniformed) {
      quotationRerquest.motorQuotationParams.MotorDiscounts.push({ MotorDiscountItem: 3, Selected: true });
    }
    if (this.quotationInput.secondVehicle) {
      quotationRerquest.motorQuotationParams.MotorDiscounts.push({ MotorDiscountItem: 1, Selected: true });
    }

    this.packageCoverItems.forEach(element => {
      quotationRerquest.motorQuotationParams.MotorCovers.push( {
        MotorCoverItem: element.MotorCoverItem,
        Selected: true
      });
    });

    console.log( 'Quotation Request' );
    console.log(quotationRerquest);

    // Prepare MVP quotation data save

    const mvpQuotation: IQuotationInfo = {
      BirthDate: this.quotationInput.birthDate,
      CC: this.quotationInput.cc,
      ContractStartDate: this.quotationInput.contractStartDate,
      County: this.quotationInput.county,
      LicenseYear: this.quotationInput.driverLicenseYear,
      MarkaCode: this.quotationInput.markaCode,
      OldestDriverBirthDate: this.quotationInput.oldestDriverBirthDate,
      OldestDriverLicenseYear: this.quotationInput.oldestDriverLicenseYear,
      PlateNo: this.quotationInput.plateNo,
      VehicleLicenseYear: this.quotationInput.vehicleLicenseYear,
      VehicleValue: this.quotationInput.vehicleValue,
      YoungestDriverBirthDate: this.quotationInput.youngestDriverBirthDate,
      YoungestDriverLicenseYear: this.quotationInput.youngestDriverLicenseYear,
      Zip: this.quotationInput.zip,
    };

    // MVP quotation data save

    this.mvpApiService.postQuotation( mvpQuotation )
      .subscribe(
        () => {},
        (err: ErrorInfo) => {
          console.error('Component log: ' + JSON.stringify(err));
          this.toastr.error(err.friendlyMessage, 'Σφάλμα');
        }
      );

    // Perform actual quotation

    this.busyQuotations = this.onlineIssueService.getQuotation(quotationRerquest)
      .subscribe(
        (data: IQuotationResponse) => {

          this.quotationResult = data.CalculatedQuotationsResult[0];
          console.log('quotationResult Data:');
          console.log(this.quotationResult);

          if (this.quotationResult) {

            if (this.quotationResult.Allow) {

              this.covers = this.quotationResult.Covers
                .filter((cover: ICover) => { if (cover.Allowed) { return cover; } })
                .sort((c1: ICover, c2: ICover) => c1.VisibilityOrder - c2.VisibilityOrder);

                console.log( 'Covers returned' );
                console.log( this.covers );

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

  updatePublicServant(value: boolean): void {
    this.quotationInput.publicServant = value;
    if (!value) {
      this.quotationInput.uniformed = false;
    }
  }

  setActiveTab(tab: number) {
    this.activeTab = tab;
  }

  validateMarka(event): boolean {
    return this.quotationInput.markaCode !== 0;
  }
}
