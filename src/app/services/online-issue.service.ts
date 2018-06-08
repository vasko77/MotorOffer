import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { IMarka } from '../models/Marka';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { map, tap, flatMap, catchError, filter } from 'rxjs/operators';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import { ICover } from '../models/cover';
import { IGetListItemsRequest } from '../models/online-issue-contracts/get-list-items-request';
import { ITestInfo } from '../models/test/test-info';
import { IMotorItem, IMotorItemsData } from '../models/online-issue-contracts/motor-item';
import { ErrorInfo } from '../models/errorInfo';
import { IFastQuotationRequest } from '../models/online-issue-contracts/fast-quotation-request';
import { IFastQuotationResponse } from '../models/online-issue-contracts/fast-quotation-response';

@Injectable({
  providedIn: 'root'
})
export class OnlineIssueService {

  private markesUrl = 'api/markes';

  constructor(private httpClient: HttpClient) { }
  /*
  getMarkes(): Observable<IMarka[]> {

    const request: IGetListItemsRequest = {
      Header: { CultureName: 'GR', ServiceVersion: '1' },
      ItemListSelector: 32
    };

    const url = 'https://portaluat.eurolife.gr/MotorWebApi/api/Motor/GetListItems';

    console.log( 'Service Request' + JSON.stringify(request));

    this.httpClient.post<IMotorItem[]>(url, request)
      .pipe(
        flatMap( motorItems => motorItems ),
        map( motorItem => <IMarka>{ id: motorItem.ItemID, description: motorItem.ItemName  } ),
        tap( item => { this.markes.push( item ); console.log( item ); } ),
        tap( data => console.log( 'Data log: ' + data ) ),
        catchError( err => this.HandleHttpError(err) ),
      ).subscribe(
        data => console.log( data )
      );

      return of( this.markes );
  }
  */
  getMarkes(): Observable<IMotorItemsData | ErrorInfo> {

    const request: IGetListItemsRequest = {
      Header: { CultureName: 'GR', ServiceVersion: '1' },
      ItemListSelector: 32
    };

    const url = 'https://portaluat.eurolife.gr/MotorWebApi/api/Motor/GetListItems';

    // console.log( 'Service Request' + JSON.stringify(request));

    return this.httpClient.post<IMotorItemsData>(url, request)
      .pipe(
        // tap( ( data: any ) => { this.paramData = data; /*console.log( 'Service Data: ' + JSON.stringify( this.markes ) );*/ } ),
        catchError(err => this.HandleHttpError(err)),
    );
  }

  getInitialQuotation(): Observable<IFastQuotationResponse | ErrorInfo> {

    const request: IFastQuotationRequest = {
      Header: { CultureName: 'GR', ServiceVersion: '1' },
      motorQuotationParams: {
        InsuranceStartDate: '2018-6-30',
        MainDriverInfo: {
          BirthDate: '1964-06-12',
          LicenseDate: '2000-01-01',
          PostalCode: '17236'
        },
        VehicleInfo: {
          AssemblyDate: '1996-01-01',
          EurotaxBrandCode: 4,
          EurotaxModelCode: 12773,
          EurotaxModelGroupCode: 30,
          HasAlarmImmobilizer: false,
          HP: '10',
          IsKeptInGarage: false,
          PlateNumber: 'ZZZ1223',
          PurchaseDate: '1996-01-01',
          UsageType: '00',
          VehicleValue: 5000
        },
        MotorCovers: [
          {
            MotorCoverItem: 1,
            Selected: true
          }
        ],
        MotorDiscounts: [
          {
            MotorDiscountItem: 2,
            Selected: true
          }
        ]
      }
    };

    console.log('Service Request' + JSON.stringify(request));

    const url = 'https://portaluat.eurolife.gr/MotorWebApi/api/Motor/FastQuotation';

    return this.httpClient.post<IFastQuotationResponse>(url, request)
      .pipe(
        // filter( ( data: IFastQuotationResponse ) => data.CalculatedQuotationsResult.Covers )
        /*
        map((data: IFastQuotationResponse) => {
          const x =
            <IFastQuotationResponse>{
              CalculatedQuotationsResult: data.CalculatedQuotationsResult,
              Header: data.Header
            };
          // tslint:disable-next-line:max-line-length
          x.CalculatedQuotationsResult.Covers = x.CalculatedQuotationsResult.Covers.sort(function (a, b) {
            if (a.VisibilityOrder && b.VisibilityOrder) {
              return b.VisibilityOrder - a.VisibilityOrder;
            } else {
              return 0;
            }
          }
          );
          return x;
        }),
        */
        tap((data: IFastQuotationResponse) => { console.log('Service Data: ' + JSON.stringify(data)); }),
        catchError(err => this.HandleHttpError(err)),
    );

  }

  getAuthenticationInfo(): Observable<ITestInfo | ErrorInfo> {

    const url = 'http://localhost:64205/api/Authorize';

    const request: ITestInfo = { name: 'vasko' };

    return this.httpClient.post<ITestInfo>(url, request)
      .do(data => { console.log('Service Response' + JSON.stringify(data)); })
      .pipe(
        catchError(err => this.HandleHttpError(err)),
    );

  }

  private HandleHttpError(err: HttpErrorResponse): Observable<ErrorInfo> {
    console.error('Logged by Vasko: ' + JSON.stringify(err));
    const error = new ErrorInfo();
    error.errorNumber = 100;
    error.message = err.statusText;
    error.friendlyMessage = 'Error occured';
    return ErrorObservable.create(error);
  }
}
