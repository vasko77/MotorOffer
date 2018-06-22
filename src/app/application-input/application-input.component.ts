import { Component, OnInit } from '@angular/core';
import { IApplicationInputParams } from '../models/application-input-params';
import { Subscription } from 'rxjs/internal/Subscription';
import { IApplicationRequest } from '../models/online-issue-contracts/quotation-request';

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
      idCardNumber: '',
      taxOffice: '',
      zip: ''
    };
   }

  ngOnInit() {
  }

  saveProposal(): void {

    const applicationReuest: IApplicationRequest = {
      Header: {
        CultureName: 'GR',
        ServiceVersion: '1'
      },

      MotorQuotationParams: {
        InsuranceStartDate: '',
        MotorInsurancePackage: '',
        MainDriverInfo: {
          BirthDate: '',
          LicenseDate: '',
          PostalCode: ''
        },
        VehicleInfo: {
          AssemblyDate: '',
          PurchaseDate: '',
          CC: '',
          EurotaxBrandCode: 0,
          EurotaxModelCode: 0,
          EurotaxModelGroupCode: 0,
          HasAlarmImmobilizer: false,
          IsKeptInGarage: false,
          PlateNumber: '',
          UsageType: '00',
          VehicleValue: 0
        },
        MotorCovers: [
        ],
        MotorDiscounts: [
        ],
        OtherDrivers: [
        ]
      }
      ,
      CustomerDetails: {
        FirstName: '',
        LastName: '',
        FatherName: '',
        Email: '',
        PhoneNumber1: '',
        IdentityNumber: '',
        TaxIdentificationNumber: '',
        AmountPayable: 0,
        HasAcceptedConditions: false,
        InsuranceDuration: '12'
      }
    };

  }

}
