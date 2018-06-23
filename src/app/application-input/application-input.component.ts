import { Component, OnInit } from '@angular/core';
import { IApplicationInputParams } from '../models/application-input-params';
import { Subscription } from 'rxjs/internal/Subscription';
import { IApplicationRequest } from '../models/online-issue-contracts/quotation-request';
import { OnlineIssueService } from '../services/online-issue.service';
import { MvpApiService } from '../services/mvp-api.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { AuthenticationService } from '../services/authentication.service';
import { ErrorInfo } from '../models/errorInfo';
import { IApplicationResponse, IError } from '../models/online-issue-contracts/quotation-response';
import { IMotorItemsData } from '../models/online-issue-contracts/motor-item';

@Component({
  templateUrl: './application-input.component.html',
  styleUrls: ['./application-input.component.scss']
})
export class ApplicationInputComponent implements OnInit {

  mouseOverSubmit: boolean;
  busyProposal: Subscription;

  showSaveProposal: boolean;
  applicationResponse: IApplicationResponse;
  errors: IError[] = [];

  applicationInput: IApplicationInputParams;
  taxOffices: IMotorItemsData;

  constructor(private onlineIssueService: OnlineIssueService,
    private mvpApiService: MvpApiService,
    private toastr: ToastrService,
    private router: Router,
    public authenticationService: AuthenticationService) {

      this.applicationInput = {
      firstName: '',
      lastName: '',
      fatherName: '',
      address: '',
      city: '',
      eMail: '',
      phone1: '',
      profession: '',
      gender: 0,
      taxNumber: '',
      idCardNumber: '',
      taxOffice: 0,
      zip: ''
    };

    this.showSaveProposal = true;
   }

  ngOnInit() {
    this.onlineIssueService.getTaxOffices()
      .subscribe(
        (data: IMotorItemsData) => { this.taxOffices = data; },
        (err: any) => {
          console.error('Component log: ' + JSON.stringify(err));
          setTimeout(() => this.toastr.error(err.friendlyMessage, 'Σφάλμα'));
        }
      );
  }

  saveProposal(): void {

    const applicationRequest: IApplicationRequest = {
      Header: {
        CultureName: 'GR',
        ServiceVersion: '1'
      },

      MotorQuotationParams: {
        InsuranceStartDate: this.onlineIssueService.quotationInput.contractStartDate.toISOString().split('T')[0],
        MotorInsurancePackage: 'MVP',
        MainDriverInfo: {
          BirthDate: this.onlineIssueService.quotationInput.birthDate.toISOString().split('T')[0],
          LicenseDate: `${this.onlineIssueService.quotationInput.driverLicenseYear}-01-01`,
          PostalCode: this.onlineIssueService.quotationInput.zip,
          TaxIdentificationNumber: this.applicationInput.taxNumber
        },
        VehicleInfo: {
          AssemblyDate: `${this.onlineIssueService.quotationInput.vehicleLicenseYear}-01-01`,
          PurchaseDate: this.onlineIssueService.quotationInput.vehiclePurchaseDate.toISOString().split('T')[0],
          CC: this.onlineIssueService.quotationInput.cc.toString(),
          EurotaxBrandCode: this.onlineIssueService.quotationInput.markaCode,
          EurotaxModelCode: 0,
          EurotaxModelGroupCode: 0,
          HasAlarmImmobilizer: false,
          IsKeptInGarage: false,
          PlateNumber: this.onlineIssueService.quotationInput.plateNo,
          UsageType: '00',
          VehicleValue: this.onlineIssueService.quotationInput.vehicleValue
        },
        MotorCovers: [
        ],
        MotorDiscounts: [
        ],
        OtherDrivers: [
        ]
      },
      CustomerDetails: {
        FirstName: this.applicationInput.firstName,
        LastName: this.applicationInput.lastName,
        FatherName: this.applicationInput.fatherName,
        Email: this.applicationInput.eMail,
        PhoneNumber1: this.applicationInput.phone1,
        IdentityNumber: this.applicationInput.idCardNumber,
        TaxIdentificationNumber: this.applicationInput.taxNumber,
        AmountPayable: this.onlineIssueService.amountPayable,
        HasAcceptedConditions: true,
        InsuranceDuration: this.onlineIssueService.quotationInput.contractDuration,
        InitialPaymentType: 3 // Cach
      }
    };

    if (this.onlineIssueService.quotationInput.youngestDriverBirthDate) {
      applicationRequest.MotorQuotationParams.OtherDrivers.push({
        BirthDate: this.onlineIssueService.quotationInput.youngestDriverBirthDate.toISOString().split('T')[0],
        LicenseDate: `${this.onlineIssueService.quotationInput.youngestDriverLicenseYear}-01-01`,
        TypeOfDriver: 2
      });
    }

    if (this.onlineIssueService.quotationInput.oldestDriverBirthDate) {
      applicationRequest.MotorQuotationParams.OtherDrivers.push({
        BirthDate: this.onlineIssueService.quotationInput.oldestDriverBirthDate.toISOString().split('T')[0],
        LicenseDate: `${this.onlineIssueService.quotationInput.oldestDriverLicenseYear}-01-01`,
        TypeOfDriver: 3
      });
    }

    if (this.onlineIssueService.quotationInput.publicServant) {
      applicationRequest.MotorQuotationParams.MotorDiscounts.push({ MotorDiscountItem: 2, Selected: true, DiscountValue: '' });
    }
    if (this.onlineIssueService.quotationInput.uniformed) {
      // tslint:disable-next-line:max-line-length
      applicationRequest.MotorQuotationParams.MotorDiscounts.push({ MotorDiscountItem: 3, Selected: true, DiscountValue: this.onlineIssueService.quotationInput.uniformedCode.toString() });
    }
    if (this.onlineIssueService.quotationInput.secondVehicle) {
      // tslint:disable-next-line:max-line-length
      applicationRequest.MotorQuotationParams.MotorDiscounts.push({ MotorDiscountItem: 1, Selected: true, DiscountValue: this.onlineIssueService.quotationInput.plateNo2 });
    }

    console.log( 'applicationRequest' );
    console.log( JSON.stringify(applicationRequest) );

    this.busyProposal = this.onlineIssueService.insertProposal(applicationRequest)
      .subscribe(
        ( data: IApplicationResponse ) => {

          console.log( 'Applicaiton Response' );
          console.log( data );

          if ( data.Success ) {

            this.applicationResponse = data;
            this.showSaveProposal = false;

            this.router.navigate(['/application-success', data.ProposalNumber]);

          } else {

            this.errors = data.Errors;
            this.showSaveProposal = true;
          }
        },
        (err: ErrorInfo) => {
          console.error('Component log: ' + JSON.stringify(err));
          this.toastr.error(err.friendlyMessage, 'Σφάλμα');
        }
      );

  }

  validateGender(event): boolean {
    return this.applicationInput.gender !== 0;
  }

  validateTaxOffice(event): boolean {
    return this.applicationInput.taxOffice !== 0;
  }

}
