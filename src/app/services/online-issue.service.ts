import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { tap, catchError } from 'rxjs/operators';
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
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class OnlineIssueService {

  quotationResponse: IQuotationResponse;

  constructor(private httpClient: HttpClient) { }

  getMarkes(): Observable<IMotorItemsData | ErrorInfo> {

    const request: IGetListItemsRequest = {
      Header: { CultureName: 'GR', ServiceVersion: '1' },
      ItemListSelector: 32
    };

    const url = environment.urlGetListItems;

    return this.httpClient.post<IMotorItemsData>(url, request)
      .pipe(
        catchError(err => this.HandleHttpError(err)),
    );
  }

  getQuotation(request: IQuotationRequest): Observable<IQuotationResponse | ErrorInfo> {

    const url = environment.urlFastQuotation;

    return this.httpClient.post<IQuotationResponse>(url, request)
      .pipe(
        tap( (data: IQuotationResponse) => { this.quotationResponse = data; } ),
        catchError(err => this.HandleHttpError(err)),
    );

  }

  getPackageCovers(): Observable<ICoversResponse | ErrorInfo> {

    const url = environment.urlGetPackageCovers;

    const request: ICoversRequest = {
      Header: {
        CultureName: 'GR',
        ServiceVersion: '1'
      },
      AgentCode: 20170,
      CoverParameters: [
        {
          MotorInsurancePackage: 'MVP',
          VehicleUsage: '00',
          InsuranceStartDate: '2018-06-30'
        }
      ]
    };

    return this.httpClient.post<ICoversResponse>(url, request)
      .pipe(
        tap((data: ICoversResponse) => {
             data.CoversCollection[0].CoverItem = data.CoversCollection[0].CoverItem
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
}
