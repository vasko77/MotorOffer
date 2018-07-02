import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
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
import { ContactInputParams } from '../models/contact-input-params';
import { IContactInfo } from '../models/mvp-contracts/contact-info';
import { date2String } from '../utilities/conversions';


@Component({
  encapsulation: ViewEncapsulation.None,
  templateUrl: './offer-input.component.html',
  styleUrls: ['./offer-input.component.scss']
})
export class OfferInputComponent implements OnInit {

  busyMarkes: Subscription;
  busyMunicipalities: Subscription;
  busyUniformed: Subscription;
  busyQuotations: Subscription;

  success: boolean;
  open: boolean;

  // authenticationInfo: IAuthentication;
  enterContactInfo = true;
  setCoversCheck: boolean;
  optionalCoversCheck: boolean;
  personalData: boolean;
  latinCharacters: boolean;

  GrossPremiums12: number;
  GrossPremiums6: number;
  GrossPremiums3: number;

  coverReplacementNotAllowed: boolean;

  quotationInput = new QuotationInputParams();
  contactInput = new ContactInputParams();
  mouseOverSubmit: boolean;
  initialInfo = true;

  markesData: IMotorItemsData;
  uniformedData: IMotorItemsData;
  municipalityData: IMotorItemsData;
  quotationResult: ICalculatedQuotationsResult;
  setCovers: ICover[];
  optionalCovers: ICover[];
  mandatoryCovers: ICover[];
  packageOptionalCoverItems: ICoverItem[];
  packageAllCoverItems: ICoverItem[];
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

  get amountPayable(): number {
    switch (this.quotationInput.contractDuration) {
      case '12': return this.GrossPremiums12 + this.coversAmount12;
      case '6': return this.GrossPremiums6 + this.coversAmount6;
      case '3': return this.GrossPremiums3 + this.coversAmount3;
      default: return 0;
    }
  }


  get setCoversAmount12(): number {
    return this.calculateSumSetCovers(0);
  }

  get setCoversAmount6(): number {
    return this.calculateSumSetCovers(1);
  }

  get setCoversAmount3(): number {
    return this.calculateSumSetCovers(2);
  }

  get setInitialCoversAmount12(): number {
    return this.calculateSumSetCoversInit(0);
  }

  get setInitialCoversAmount6(): number {
    return this.calculateSumSetCoversInit(1);
  }

  get setInitialCoversAmount3(): number {
    return this.calculateSumSetCoversInit(2);
  }

  get setCoversInitialAmount(): number {
    switch (this.quotationInput.contractDuration) {
      case '12': return this.setInitialCoversAmount12;
      case '6': return this.setInitialCoversAmount6;
      case '3': return this.setInitialCoversAmount3;
      default: return 0;
    }
  }
  get setCoversAmount(): number {
    switch (this.quotationInput.contractDuration) {
      case '12': return this.setCoversAmount12;
      case '6': return this.setCoversAmount6;
      case '3': return this.setCoversAmount3;
      default: return 0;
    }
  }

  maxDateBirth = new Date();
  minStartDate = new Date();
  maxStartDate = new Date();

  constructor(private onlineIssueService: OnlineIssueService,
    private mvpApiService: MvpApiService,
    private toastr: ToastrService,
    private router: Router,
    public authenticationService: AuthenticationService) {

    this.quotationInput.markaCode = '0';
    this.quotationInput.municipalityCode = '0';
    this.quotationInput.uniformedCode = 0;
    this.quotationInput.contractDuration = '12';
    this.maxDateBirth = new Date();
    this.maxDateBirth.setFullYear(this.maxDateBirth.getFullYear() - 18);
    this.minStartDate.setDate(this.minStartDate.getDate() + 1);
    this.maxStartDate.setMonth(this.minStartDate.getMonth() + 1);

    if (this.mvpApiService.quotationInfo) {
      this.quotationInput.birthDate = new Date(this.mvpApiService.quotationInfo.BirthDate);
      this.quotationInput.cc = this.mvpApiService.quotationInfo.CC;
      this.quotationInput.contractStartDate = new Date(this.mvpApiService.quotationInfo.ContractStartDate);
      this.quotationInput.driverLicenseYear = this.mvpApiService.quotationInfo.DriverLicenseYear;
      this.quotationInput.markaCode = this.mvpApiService.quotationInfo.MarkaCode;
      this.quotationInput.municipalityCode = this.mvpApiService.quotationInfo.MunicipalityCode;
      this.quotationInput.oldestDriverBirthDate = new Date(this.mvpApiService.quotationInfo.OldestDriverBirthDate);
      this.quotationInput.oldestDriverLicenseYear = this.mvpApiService.quotationInfo.OldestDriverLicenseYear;
      this.quotationInput.plateNo = this.mvpApiService.quotationInfo.PlateNo;
      this.quotationInput.publicServant = this.mvpApiService.quotationInfo.PublicServant;
      this.quotationInput.secondVehicle = this.mvpApiService.quotationInfo.SecondVehicle;
      this.quotationInput.uniformed = this.mvpApiService.quotationInfo.Uniformed;
      this.quotationInput.vehicleLicenseYear = this.mvpApiService.quotationInfo.VehicleLicenseYear;
      this.quotationInput.vehicleValue = this.mvpApiService.quotationInfo.VehicleValue;
      this.quotationInput.youngestDriverBirthDate = new Date(this.mvpApiService.quotationInfo.YoungestDriverBirthDate);
      this.quotationInput.youngestDriverLicenseYear = this.mvpApiService.quotationInfo.YoungestDriverLicenseYear;
      this.quotationInput.zip = this.mvpApiService.quotationInfo.Zip;
    }
  }

  private calculateSum(duration: number): number {
    let sum = 0;

    if (this.optionalCovers) {
      this.optionalCovers.forEach(cover => {
        // console.log( JSON.stringify( element ));
        if (cover.Selected && cover.CoverPremia.length >= duration && cover.CoverPremia[duration]) {
          sum += cover.CoverPremia[duration].CoverPremium;
        }
      });
    }

    if (this.setCovers) {
      this.setCovers.forEach(cover => {
        // console.log( JSON.stringify( element ));
        if (cover.Selected && cover.CoverPremia.length >= duration && cover.CoverPremia[duration]) {
          sum += cover.CoverPremia[duration].CoverPremium;
        }
      });
    }

    return sum;
  }

  private calculateSumSetCovers(duration: number): number {
    let sum = 0;

    if (this.setCovers) {
      this.setCovers.forEach(cover => {
        // console.log( JSON.stringify( element ));
        if (cover.Selected && cover.CoverPremia.length >= duration && cover.CoverPremia[duration]) {
          sum += cover.CoverPremia[duration].CoverPremium;
        }
      });
    }

    return sum;
  }

  private calculateSumSetCoversInit(duration: number): number {
    let sum = 0;

    if (this.setCovers) {
      this.setCovers.forEach(cover => {
        // console.log( JSON.stringify( element ));
        if (cover.CoverPremia.length >= duration && cover.CoverPremia[duration]) {
          sum += cover.CoverPremia[duration].CoverPremium;
        }
      });
    }

    return sum;
  }

  ngOnInit() {

    if (!this.authenticationService.authenticationInfo) {
      this.authenticationService.getAuthenticationInfo()
        .subscribe(
          (data: IAuthentication) => {
            console.log(data);
            // this.authenticationInfo = data;
          },
          (err: any) => {
            console.error('Component log: ' + JSON.stringify(err));
            // setTimeout(() => this.toastr.error('*****************', 'Σφάλμα'));
          }
        );
    }

    this.busyMarkes = this.onlineIssueService.getMarkes()
      .subscribe(
        (data: IMotorItemsData) => { this.markesData = data; },
        (err: any) => {
          console.error('Component log: ' + JSON.stringify(err));
          setTimeout(() => this.toastr.error(err.friendlyMessage, 'Σφάλμα'));
        }
      );

    this.busyMunicipalities = this.onlineIssueService.getMunicipalities()
      .subscribe(
        (data: IMotorItemsData) => { this.municipalityData = data; },
        (err: any) => {
          console.error('Component log: ' + JSON.stringify(err));
          setTimeout(() => this.toastr.error(err.friendlyMessage, 'Σφάλμα'));
        }
      );

    this.busyUniformed = this.onlineIssueService.getUniformed()
      .subscribe(
        (data: IMotorItemsData) => { this.uniformedData = data; },
        (err: any) => {
          console.error('Component log: ' + JSON.stringify(err));
          setTimeout(() => this.toastr.error(err.friendlyMessage, 'Σφάλμα'));
        }
      );

    if (this.onlineIssueService.packageOptionalCoverItems) {
      this.packageOptionalCoverItems = this.onlineIssueService.packageOptionalCoverItems;
      this.packageAllCoverItems = this.onlineIssueService.packageAllCoverItems;
    } else {
      this.busyQuotations = this.onlineIssueService.getPackageCovers()
        .subscribe(
          (data: ICoversResponse) => {
            // tslint:disable-next-line:max-line-length
            this.packageOptionalCoverItems = data.CoversCollection[0].CoverItem.filter((item: ICoverItem) => item.Allowed && !item.IsMandatory);
            this.packageAllCoverItems = data.CoversCollection[0].CoverItem;
          },
          (err: ErrorInfo) => {
            console.error('Component log: ' + JSON.stringify(err));
            setTimeout(() => this.toastr.error(err.friendlyMessage, 'Σφάλμα'));
          }
        );
    }

    console.log('this.mvpApiService.plateNo:' + this.mvpApiService.plateNo);
    if (this.mvpApiService.plateNo) {
      this.loadQuotationInfo(this.mvpApiService.plateNo);
    }
  }

  loadQuotationInfo(plateNo: string): void {

    console.log('plateNo: ' + plateNo);
    console.log('this.quotationInput.plateNo: ' + this.quotationInput.plateNo);

    if (!this.authenticationService.authenticationInfo
      || !this.authenticationService.authenticationInfo.efginsUser
      || !plateNo) {
      return;
    }


    this.mvpApiService.getQuotation(this.quotationInput.plateNo)
      .subscribe(
        (quot: IQuotationInfo) => {
          this.quotationInput.markaCode = quot.MarkaCode;
          this.quotationInput.municipalityCode = quot.MunicipalityCode;
          this.quotationInput.birthDate = new Date(quot.BirthDate);
          this.quotationInput.cc = quot.CC;
          this.quotationInput.contractStartDate = new Date(quot.ContractStartDate);
          this.quotationInput.vehiclePurchaseDate = new Date(quot.VehiclePurchaseDate);
          this.quotationInput.driverLicenseYear = quot.DriverLicenseYear;
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
          this.quotationInput.publicServant = quot.PublicServant;
          this.quotationInput.uniformed = quot.Uniformed;
          this.quotationInput.secondVehicle = quot.SecondVehicle;
          this.quotationInput.plateNo2 = quot.PlateNo2;
          this.quotationInput.uniformedCode = quot.UniformedCode;

          this.quotationInput.contractDuration = quot.ContractDuration;

          console.log('Municipality Code: ' + this.quotationInput.municipalityCode.toString());

          this.quotation(quot.SelectedMotorCoverItems);

        },
        (err: ErrorInfo) => { console.log('Plate not found'); }
      );

    console.log('this.quotationInput.plateNo');
    console.log(this.quotationInput.plateNo);
    this.mvpApiService.getContact(this.quotationInput.plateNo)
      .subscribe(
        (data: IContactInfo) => {
          this.contactInput = {
            firstName: data.FirstName,
            lastName: data.LastName,
            phone: data.Phone,
            eMail: data.EMail
          };
          this.enterContactInfo = false;
          console.log('this.contactInput');
          console.log(this.contactInput);
        },
        (err: ErrorInfo) => {
          console.error('Component log: ' + JSON.stringify(err));
          this.toastr.error(err.friendlyMessage, 'Σφάλμα');
        }
      );
  }

  quotation(selectedMotorCoverItems: number[]): void {

    // Prepare quotation request

    const quotationRerquest: IQuotationRequest = {
      Header: {
        CultureName: 'GR',
        ServiceVersion: '1'
      },
      motorQuotationParams: {
        MotorInsurancePackage: 'MVP',
        InsuranceStartDate: date2String(this.quotationInput.contractStartDate),
        MainDriverInfo: {
          BirthDate: date2String(this.quotationInput.birthDate),
          LicenseDate: `${this.quotationInput.driverLicenseYear}-01-01`,
          PostalCode: this.quotationInput.zip,
          Municipality: this.quotationInput.municipalityCode,
          TaxIdentificationNumber: ''
        },
        VehicleInfo: {
          PlateNumber: this.quotationInput.plateNo,
          AssemblyDate: `${this.quotationInput.vehicleLicenseYear}-01-01`,
          PurchaseDate: date2String(this.quotationInput.vehiclePurchaseDate),
          CC: this.quotationInput.cc.toString(),
          EurotaxBrandCode: +this.quotationInput.markaCode,
          EurotaxModelCode: 0,
          EurotaxModelGroupCode: 0,
          HasAlarmImmobilizer: true,
          IsKeptInGarage: true,
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
        BirthDate: date2String(this.quotationInput.youngestDriverBirthDate),
        LicenseDate: `${this.quotationInput.youngestDriverLicenseYear}-01-01`,
        TypeOfDriver: 2
      });
    }

    if (this.quotationInput.oldestDriverBirthDate) {
      quotationRerquest.motorQuotationParams.OtherDrivers.push({
        BirthDate: date2String(this.quotationInput.oldestDriverBirthDate),
        LicenseDate: `${this.quotationInput.oldestDriverLicenseYear}-01-01`,
        TypeOfDriver: 3
      });
    }

    if (this.quotationInput.publicServant) {
      quotationRerquest.motorQuotationParams.MotorDiscounts.push({ MotorDiscountItem: 2, Selected: true, DiscountValue: '' });
    }
    if (this.quotationInput.uniformed) {
      // tslint:disable-next-line:max-line-length
      quotationRerquest.motorQuotationParams.MotorDiscounts.push({ MotorDiscountItem: 3, Selected: true, DiscountValue: this.quotationInput.uniformedCode.toString() });
    }
    if (this.quotationInput.secondVehicle) {
      // tslint:disable-next-line:max-line-length
      quotationRerquest.motorQuotationParams.MotorDiscounts.push({ MotorDiscountItem: 1, Selected: true, DiscountValue: this.quotationInput.plateNo2 });
    }

    // 1st call to quotation wihtout Optional Covers to load Gross Premiums
    this.busyQuotations = this.onlineIssueService.getQuotation(quotationRerquest)
      .subscribe(
        (data: IQuotationResponse) => {
          if (data.CalculatedQuotationsResult && data.CalculatedQuotationsResult[0].PremiumsPayable) {
            this.GrossPremiums12 = data.CalculatedQuotationsResult[0].PremiumsPayable[0].GrossPremiums;
            this.GrossPremiums6 = data.CalculatedQuotationsResult[0].PremiumsPayable[1].GrossPremiums;
            this.GrossPremiums3 = data.CalculatedQuotationsResult[0].PremiumsPayable[2].GrossPremiums;
          }
        },
        (err: ErrorInfo) => {
          console.error('Component log: ' + JSON.stringify(err));
          this.toastr.error(err.friendlyMessage, 'Σφάλμα');
        }
      );

    // Load Covers from Initial Package Covers
    this.packageOptionalCoverItems.forEach(cover => {
      quotationRerquest.motorQuotationParams.MotorCovers.push({
        MotorCoverItem: cover.MotorCoverItem,
        Selected: true
      });
    });

    console.log('Quotation Request');
    console.log(quotationRerquest);
    console.log(JSON.stringify(quotationRerquest));

    // Perform actual quotation

    this.busyQuotations = this.onlineIssueService.getQuotation(quotationRerquest)
      .subscribe(
        (data: IQuotationResponse) => {

          this.quotationResult = data.CalculatedQuotationsResult[0];
          console.log('quotationResult Data:');
          console.log(this.quotationResult);

          if (this.quotationResult) {

            if (this.quotationResult.Allow) {

              console.log('selectedMotorCoverItems');
              console.log(selectedMotorCoverItems);

              this.optionalCovers = this.quotationResult.Covers
                .filter((cover: ICover) => {
                  if (cover.Allowed && cover.Code !== 'C' && cover.Code !== 'Z' && cover.Code !== 'U' && cover.Code !== '008') {
                    return cover;
                  }
                })
                .sort((c1: ICover, c2: ICover) => c1.VisibilityOrder - c2.VisibilityOrder);

              this.optionalCovers.forEach(cover => {
                // tslint:disable-next-line:max-line-length
                cover.ShortDescription = this.packageAllCoverItems.find(c => c.MotorCoverItem === cover.MotorCoverItem).ShortDescription;
                cover.Selected = selectedMotorCoverItems ? selectedMotorCoverItems.indexOf(cover.MotorCoverItem) !== -1 : false;
                if (cover.Selected) {
                  this.optionalCoversCheck = true;
                }
              });

              this.setCovers = this.quotationResult.Covers
                .filter((cover: ICover) => {
                  if (cover.Allowed && (cover.Code === 'C' || cover.Code === 'Z' || cover.Code === 'U' || cover.Code === '008')) {
                    return cover;
                  }
                })
                .sort((c1: ICover, c2: ICover) => c1.VisibilityOrder - c2.VisibilityOrder);

              this.setCovers.forEach(cover => {
                // tslint:disable-next-line:max-line-length
                cover.ShortDescription = this.packageAllCoverItems.find(c => c.MotorCoverItem === cover.MotorCoverItem).ShortDescription;
                cover.Selected = selectedMotorCoverItems ? selectedMotorCoverItems.indexOf(cover.MotorCoverItem) !== -1 : false;
                if (cover.Selected) {
                  this.setCoversCheck = true;
                }
              });

              this.mandatoryCovers = this.quotationResult.Covers
                .filter((cover: ICover) => { if (cover.IsMandatory) { return cover; } })
                .sort((c1: ICover, c2: ICover) => c1.VisibilityOrder - c2.VisibilityOrder);

              this.mandatoryCovers.forEach(cover => {
                // tslint:disable-next-line:max-line-length
                cover.ShortDescription = this.packageAllCoverItems.find(c => c.MotorCoverItem === cover.MotorCoverItem).ShortDescription;
              });

              console.log('Covers returned');
              console.log(this.setCovers);
              console.log(this.optionalCovers);

              if (selectedMotorCoverItems) {
                this.initialInfo = true;
              } else {
                // this.initialInfo = false;
                this.mouseOverSubmit = false;
              }


            } else {

              this.errors = this.quotationResult.Errors;

            }

          } else {

            this.optionalCovers = [];

          }
        },
        (err: ErrorInfo) => {
          console.error('Component log: ' + JSON.stringify(err));
          this.toastr.error(err.friendlyMessage, 'Σφάλμα');
        }
      );
  }

  insertContact(): void {

    if (this.optionalCovers && this.setCovers) {

      if (this.optionalCovers.find((c: ICover) => c.MotorCoverItem === 22  && c.Selected)
      && !this.optionalCovers.find((c: ICover) => (c.MotorCoverItem === 15 || c.MotorCoverItem === 19) && c.Selected)
      && !this.setCovers.find((c: ICover) => (c.MotorCoverItem === 8 || c.MotorCoverItem === 13 || c.MotorCoverItem === 14) && c.Selected)
        ) {
        this.coverReplacementNotAllowed = true;
        this.open = false;
        return;
      }
    }

    this.coverReplacementNotAllowed = false;
    this.open = true;


    console.log(this.contactInput);

    // Prepare MVP quotation data save

    // console.log('this.quotationInput');
    // console.log(this.quotationInput);
    // console.log(JSON.stringify(this.quotationInput));

    const mvpQuotation: IQuotationInfo = {
      BirthDate: date2String(this.quotationInput.birthDate),
      CC: this.quotationInput.cc,
      ContractStartDate: date2String(this.quotationInput.contractStartDate),
      DriverLicenseYear: this.quotationInput.driverLicenseYear,
      VehiclePurchaseDate: date2String(this.quotationInput.vehiclePurchaseDate),
      MarkaCode: this.quotationInput.markaCode,
      MunicipalityCode: this.quotationInput.municipalityCode,
      OldestDriverBirthDate: date2String(this.quotationInput.oldestDriverBirthDate),
      OldestDriverLicenseYear: this.quotationInput.oldestDriverLicenseYear,
      PlateNo: this.quotationInput.plateNo,
      VehicleLicenseYear: this.quotationInput.vehicleLicenseYear,
      VehicleValue: this.quotationInput.vehicleValue,
      YoungestDriverBirthDate: date2String(this.quotationInput.youngestDriverBirthDate),
      YoungestDriverLicenseYear: this.quotationInput.youngestDriverLicenseYear,
      Zip: this.quotationInput.zip,
      PublicServant: this.quotationInput.publicServant,
      Uniformed: this.quotationInput.uniformed,
      SecondVehicle: this.quotationInput.secondVehicle,
      PlateNo2: this.quotationInput.plateNo2,
      ContractDuration: this.quotationInput.contractDuration,
      UniformedCode: this.quotationInput.uniformedCode,
      SelectedMotorCoverItems: []
    };

    this.optionalCovers.forEach(cover => {
      if (cover.Selected) {
        mvpQuotation.SelectedMotorCoverItems.push(cover.MotorCoverItem);
      }
    });
    this.setCovers.forEach(cover => {
      if (cover.Selected) {
        mvpQuotation.SelectedMotorCoverItems.push(cover.MotorCoverItem);
      }
    });

    // console.log('mvpQuotation');
    // console.log(mvpQuotation);
    // console.log(JSON.stringify(mvpQuotation));

    // MVP quotation data save

    this.mvpApiService.postQuotation(mvpQuotation)
      .subscribe(
        (data: IQuotationInfo) => {
          this.enterContactInfo = false;
          // this.toastr.success('Το ενδιαφέρον σας καταχωρήθηκε');

          // let amountPayableTotal = 0;
          /*
          switch ( this.quotationInput.contractDuration ) {
            case '12': this.amountPayableTotal = this.GrossPremiums12 + this.coversAmount12; break;
            case '6': this.amountPayableTotal = this.GrossPremiums6 + this.coversAmount6; break;
            case '3': this.amountPayableTotal = this.GrossPremiums3 + this.coversAmount3; break;
            default: this.amountPayableTotal = 0;
          }
          */
          // MVP contact data save
          const contactInfo: IContactInfo = {
            PlateNo: this.quotationInput.plateNo,
            FirstName: this.contactInput.firstName,
            LastName: this.contactInput.lastName,
            EMail: this.contactInput.eMail,
            Phone: this.contactInput.phone,
            Premiums: +this.amountPayable.toFixed(2)
          };

          this.mvpApiService.postContact(contactInfo)
            .subscribe(
              () => {
                // this.router.navigate(['/offer-success']);
                this.success = true;
              },
              (err: ErrorInfo) => {
                this.success = false;
                console.error('Component log: ' + JSON.stringify(err));
                this.toastr.error(err.friendlyMessage, 'Σφάλμα');
              }
            );

        },
        (err: ErrorInfo) => {
          console.error('Component log: ' + JSON.stringify(err));
          this.toastr.error(err.friendlyMessage, 'Σφάλμα');
        }
      );

  }

  applicationInput(): void {
    const mvpQuotation: IQuotationInfo = {
      BirthDate: date2String(this.quotationInput.birthDate),
      CC: this.quotationInput.cc,
      ContractStartDate: date2String(this.quotationInput.contractStartDate),
      DriverLicenseYear: this.quotationInput.driverLicenseYear,
      VehiclePurchaseDate: date2String(this.quotationInput.vehiclePurchaseDate),
      MarkaCode: this.quotationInput.markaCode,
      MunicipalityCode: this.quotationInput.municipalityCode,
      OldestDriverBirthDate: date2String(this.quotationInput.oldestDriverBirthDate),
      OldestDriverLicenseYear: this.quotationInput.oldestDriverLicenseYear,
      PlateNo: this.quotationInput.plateNo,
      VehicleLicenseYear: this.quotationInput.vehicleLicenseYear,
      VehicleValue: this.quotationInput.vehicleValue,
      YoungestDriverBirthDate: date2String(this.quotationInput.youngestDriverBirthDate),
      YoungestDriverLicenseYear: this.quotationInput.youngestDriverLicenseYear,
      Zip: this.quotationInput.zip,
      PublicServant: this.quotationInput.publicServant,
      Uniformed: this.quotationInput.uniformed,
      SecondVehicle: this.quotationInput.secondVehicle,
      PlateNo2: this.quotationInput.plateNo2,
      ContractDuration: this.quotationInput.contractDuration,
      UniformedCode: this.quotationInput.uniformedCode,
      SelectedMotorCoverItems: []
    };

    this.optionalCovers.forEach(cover => {
      if (cover.Selected) {
        mvpQuotation.SelectedMotorCoverItems.push(cover.MotorCoverItem);
      }
    });
    this.setCovers.forEach(cover => {
      if (cover.Selected) {
        mvpQuotation.SelectedMotorCoverItems.push(cover.MotorCoverItem);
      }
    });

    console.log('mvpQuotation');
    console.log(mvpQuotation);
    console.log(JSON.stringify(mvpQuotation));

    // MVP quotation data save

    this.mvpApiService.postQuotation(mvpQuotation)
      .subscribe(
        (data: IQuotationInfo) => { },
        (err: ErrorInfo) => {
          console.error('Component log: ' + JSON.stringify(err));
          this.toastr.error(err.friendlyMessage, 'Σφάλμα');
        }
      );

    this.onlineIssueService.quotationInput = this.quotationInput;
    this.onlineIssueService.amountPayable = +this.amountPayable.toFixed(2);

    /*
    switch ( this.quotationInput.contractDuration ) {
      case '12': this.onlineIssueService.amountPayable = this.GrossPremiums12 + this.coversAmount12; break;
      case '6': this.onlineIssueService.amountPayable = this.GrossPremiums6 + this.coversAmount6; break;
      case '3': this.onlineIssueService.amountPayable = this.GrossPremiums3 + this.coversAmount3; break;
      default: this.onlineIssueService.amountPayable = 0;
    }
    */

    this.router.navigate(['/application']);
  }

  updateSetCovers(selected: boolean): void {
    this.setCovers.forEach(cover => {
      cover.Selected = selected;
    });
  }

  updateOptionalCovers(selected: boolean): void {
    this.optionalCovers.forEach(cover => {
      cover.Selected = selected;
    });
    this.setCovers.forEach(cover => {
      cover.Selected = selected;
    });
  }

  getContact(): void {
  }

  updatePublicServant(value: boolean): void {
    this.quotationInput.publicServant = value;
    if (!value) {
      this.quotationInput.uniformed = false;
    }
  }

  updateSecondVehicle(value: boolean): void {
    this.quotationInput.secondVehicle = value;
    if (!value) {
      this.quotationInput.plateNo2 = '';
    }
  }

  validateMarka(event): boolean {
    return this.quotationInput.markaCode !== '0';
  }

  validateMunicipality(event): boolean {
    return this.quotationInput.municipalityCode !== '0';
  }

  validateUniformed(event): boolean {
    if (this.quotationInput.uniformed) {
      return this.quotationInput.uniformedCode !== 0;
    } else {
      return true;
    }
  }

  plateNoToUpper(value: string): void {
    if (value.length > 0) {
      this.quotationInput.plateNo = value.toUpperCase();
    } else {
      this.quotationInput.plateNo = value;
    }
  }

  setCoversCheckAll(value: boolean): void {
    this.setCovers.forEach(cover => { cover.Selected = value; });
  }


  get foundReplacement(): boolean {
    if (this.optionalCovers && this.setCovers) {
      return this.optionalCovers.find((c: ICover) => c.MotorCoverItem === 22 && c.Selected) !== undefined;
    } else {
      return false;
    }
  }


  get foundOther(): boolean {
    if (this.optionalCovers && this.setCovers) {
      return this.optionalCovers.find((c: ICover) => ( c.MotorCoverItem === 15 || c.MotorCoverItem === 19 ) && c.Selected  ) !== undefined;
    } else {
      return false;
    }
  }


  openContactInfoArea(): void {

    if (this.optionalCovers && this.setCovers) {

      if (this.optionalCovers.find((c: ICover) => c.MotorCoverItem === 22  && c.Selected)
      && !this.optionalCovers.find((c: ICover) => (c.MotorCoverItem === 15 || c.MotorCoverItem === 19) && c.Selected)
      && !this.setCovers.find((c: ICover) => (c.MotorCoverItem === 8 || c.MotorCoverItem === 13 || c.MotorCoverItem === 14) && c.Selected)
        ) {
        this.coverReplacementNotAllowed = true;
        this.open = false;
        return;
      }
    }

    this.coverReplacementNotAllowed = false;
    this.open = true;
  }
}
