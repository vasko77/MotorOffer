import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { map, tap, flatMap, catchError, filter } from 'rxjs/operators';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import { IGetListItemsRequest } from '../models/online-issue-contracts/get-list-items-request';
import { ITestInfo } from '../models/test/test-info';
import { IMotorItem, IMotorItemsData } from '../models/online-issue-contracts/motor-item';
import { ErrorInfo } from '../models/errorInfo';
import { IQuotationResponse } from '../models/online-issue-contracts/quotation-response';
import { IQuotationRequest } from '../models/online-issue-contracts/quotation-request';
import { ICoversResponse, ICoverItem } from '../models/online-issue-contracts/covers-response';
import { ICoversRequest } from '../models/online-issue-contracts/covers-request';

@Injectable({
  providedIn: 'root'
})
export class OnlineIssueService {

  covers: ICoverItem[];

  constructor(private httpClient: HttpClient) { }

  getMarkes(): Observable<IMotorItemsData | ErrorInfo> {

    const request: IGetListItemsRequest = {
      Header: { CultureName: 'GR', ServiceVersion: '1' },
      ItemListSelector: 32
    };

    const url = 'http://eh017ins178/MotorApiNoauth/api/Motor/GetListItems';

    return this.httpClient.post<IMotorItemsData>(url, request)
      .pipe(
        catchError(err => this.HandleHttpError(err)),
    );
  }

  getInitialQuotation(request: IQuotationRequest): Observable<IQuotationResponse | ErrorInfo> {

    const url = 'http://eh017ins178/MotorApiNoauth/api/Motor/FastQuotation';

    this.covers.forEach( (cover: ICoverItem ) => {
      request.motorQuotationParams.MotorCovers.push(
        {
          MotorCoverItem: cover.MotorCoverItem,
          Selected: true
        }
       );
    } );


    return this.httpClient.post<IQuotationResponse>(url, request)
      .pipe(
        catchError(err => this.HandleHttpError(err)),
    );

  }

  getPackageCovers(): Observable<ICoversResponse | ErrorInfo> {
    const url = 'http://eh017ins178/MotorApiNoauth/api/Motor/GetPackageCovers';

    const request: ICoversRequest = {
      Header: {
        CultureName: 'GR',
        ServiceVersion: '1'
      },
      AgentCode: 20170,
      CoverParameters: [
        {
          MotorInsurancePackage: 'SP7',
          VehicleUsage: '00'
        }
      ]
    };

    return this.httpClient.post<ICoversResponse>(url, request)
      .pipe(
        tap((data: ICoversResponse) => {
          this.covers = data.CoversCollection[0].CoverItem = data.CoversCollection[0].CoverItem
            .filter((item: ICoverItem) => item.Allowed)
            .sort((c1: ICoverItem, c2: ICoverItem) => c1.VisibilityOrder - c2.VisibilityOrder);
        }),
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

  /*
  getAuthenticationInfo(): Observable<ITestInfo | ErrorInfo> {

    const url = 'http://localhost:64205/api/Authorize';

    const request: ITestInfo = { name: 'vasko' };

    return this.httpClient.post<ITestInfo>(url, request)
      .do(data => { console.log('Service Response' + JSON.stringify(data)); })
      .pipe(
        catchError(err => this.HandleHttpError(err)),
    );

  }
  */
}
