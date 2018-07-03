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
import { environment } from '../../environments/environment';
import { INotificationInfo } from '../models/mvp-contracts/notification-info';
import { date2String } from '../utilities/conversions';

@Component({
  templateUrl: './application-input.component.html',
  styleUrls: ['./application-input.component.scss']
})
export class ApplicationInputComponent implements OnInit {

  mouseOverSubmit: boolean;
  busyProposal: Subscription;
  peronalDataConcent: boolean;

  showSaveProposal: boolean;
  applicationResponse: IApplicationResponse;
  errors: IError[] = [];

  applicationInput: IApplicationInputParams;
  taxOffices: IMotorItemsData;

  constructor(public onlineIssueService: OnlineIssueService,
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
      zip: '',
      eMail: '',
      phone1: '',
      profession: '',
      gender: 0,
      taxNumber: '',
      idCardNumber: '',
      taxOffice: 0,
      PromotionConcentEFG: false,
      PromotionConcentOther: false
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
        InsuranceStartDate: date2String(this.onlineIssueService.quotationInput.contractStartDate),
        MotorInsurancePackage: 'MVP',
        MainDriverInfo: {
          BirthDate: date2String(this.onlineIssueService.quotationInput.birthDate),
          LicenseDate: `${this.onlineIssueService.quotationInput.driverLicenseYear}-01-01`,
          PostalCode: this.onlineIssueService.quotationInput.zip,
          TaxIdentificationNumber: this.applicationInput.taxNumber,
          Municipality: this.onlineIssueService.quotationInput.municipalityCode.toString()
        },
        VehicleInfo: {
          AssemblyDate: `${this.onlineIssueService.quotationInput.vehicleLicenseYear}-01-01`,
          PurchaseDate: date2String(this.onlineIssueService.quotationInput.vehiclePurchaseDate),
          CC: this.onlineIssueService.quotationInput.cc.toString(),
          EurotaxBrandCode: +this.onlineIssueService.quotationInput.markaCode,
          EurotaxModelCode: 0,
          EurotaxModelGroupCode: 0,
          HasAlarmImmobilizer: true,
          IsKeptInGarage: true,
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
        Address: this.applicationInput.address,
        Sex: this.applicationInput.gender.toString(),
        City: this.applicationInput.city,
        PostalCode: this.applicationInput.zip,
        PhoneNumber1: this.applicationInput.phone1,
        IdentityNumber: this.applicationInput.idCardNumber,
        TaxIdentificationNumber: this.applicationInput.taxNumber,
        DOY: this.applicationInput.taxOffice.toString(),
        AmountPayable: this.onlineIssueService.amountPayable,
        HasAcceptedConditions: true,
        InsuranceDuration: this.onlineIssueService.quotationInput.contractDuration,
        InitialPaymentType: 3, // Cach
        ContractBySMS_Email: '1',
        SameAsInsured: true,
        BirthDate: new Date(this.onlineIssueService.quotationInput.birthDate),
        AcceptedUsageOfPersonalData: true,
        PromotionConcentEFG: this.applicationInput.PromotionConcentEFG,
        PromotionConcentOther: this.applicationInput.PromotionConcentOther
      }
    };

    if (this.onlineIssueService.quotationInput.youngestDriverBirthDate) {
      applicationRequest.MotorQuotationParams.OtherDrivers.push({
        BirthDate: date2String(this.onlineIssueService.quotationInput.youngestDriverBirthDate),
        LicenseDate: `${this.onlineIssueService.quotationInput.youngestDriverLicenseYear}-01-01`,
        TypeOfDriver: 2
      });
    }

    if (this.onlineIssueService.quotationInput.oldestDriverBirthDate) {
      applicationRequest.MotorQuotationParams.OtherDrivers.push({
        BirthDate: date2String(this.onlineIssueService.quotationInput.oldestDriverBirthDate),
        LicenseDate: `${this.onlineIssueService.quotationInput.oldestDriverLicenseYear}-01-01`,
        TypeOfDriver: 3
      });
    }

    this.mvpApiService.quotationInfo.SelectedMotorCoverItems.forEach(cover => {
      applicationRequest.MotorQuotationParams.MotorCovers.push({
        MotorCoverItem: cover,
        Selected: true
      });
    });

    this.onlineIssueService.packageMandatoryCoverItems.forEach(cover => {
      applicationRequest.MotorQuotationParams.MotorCovers.push({
        MotorCoverItem: cover.MotorCoverItem,
        Selected: true
      });
    });

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

    console.log('applicationRequest');
    console.log(JSON.stringify(applicationRequest));

    this.busyProposal = this.onlineIssueService.insertProposal(applicationRequest)
      .subscribe(
        (applicationResponse: IApplicationResponse) => {

          console.log('Applicaiton Response');
          console.log(applicationResponse);

          if (applicationResponse.Success) {

            this.applicationResponse = applicationResponse;
            this.showSaveProposal = false;

            console.log('Application Response');
            console.log(JSON.stringify(applicationResponse));

            if (this.applicationInput.eMail) {
              this.sendEmail(applicationResponse);
            }

            this.router.navigate(['/application-success', applicationResponse.ProposalID]);

          } else {

            this.errors = applicationResponse.Errors;
            this.showSaveProposal = true;
          }
        },
        (err: ErrorInfo) => {
          console.error('Component log: ' + JSON.stringify(err));
          this.toastr.error(err.friendlyMessage, 'Σφάλμα');
        }
      );

  }

  sendEmail(data: IApplicationResponse): void {

    const notification: INotificationInfo = {
      email: this.applicationInput.eMail,
      birthDate: this.mvpApiService.quotationInfo.BirthDate,
      fullName: this.applicationInput.lastName + ' ' + this.applicationInput.firstName,
      gender: this.applicationInput.gender.toString(),
      refNo: data.ReferenseNumber,
      seqNo: data.AAReferenseID,
      taxId: this.applicationInput.taxNumber
    };

    this.mvpApiService.postNotification(notification)
      .subscribe(
        (notificationInfo: INotificationInfo) => { },
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
