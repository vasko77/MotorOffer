import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { IMarka } from '../models/Marka';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/observable/of';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { map, tap, flatMap, catchError } from 'rxjs/operators';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/catch';
import { ICover } from '../models/cover';
import { IGetListItemsRequest } from '../models/online-issue-contracts/get-list-items-request';
import { ITestInfo } from '../models/test/test-info';
import { IMotorItem } from '../models/online-issue-contracts/motor-item';
import { ErrorInfo } from '../models/errorInfo';

@Injectable({
  providedIn: 'root'
})
export class OnlineIssueService {

  private markesUrl = 'api/markes';
  private markes: IMarka[];

  constructor(private httpClient: HttpClient) { }

  getMarkes(): Observable<IMarka[]> {

    const request: IGetListItemsRequest = {
      Header: { CultureName: 'GR', ServiceVersion: '1' },
      ItemListSelector: 32
    };

    const url = 'https://portaluat.eurolife.gr/MotorWebApi/api/Motor/GetListItems';

    // const headers: HttpHeaders = { headers: '' };

    console.log( 'Service Request' + JSON.stringify(request));

    this.httpClient.post<IMotorItem[]>(url, request)
      // .do(data => {console.log( 'Service Response' + JSON.stringify(data)); })
      .pipe(
        // flatMap( motorItems => motorItems ),
        // map( motorItem => <IMarka>{ id: motorItem.ItemID, description: motorItem.ItemName  } ),
        // tap( item => { this.markes.push( item ); console.log( item ); } ),
        tap( data => console.log( 'POST' ) ),
        tap( data => console.log( data ) ),
        catchError( err => this.HandleHttpError(err) ),
      ).subscribe();

      return of( this.markes );
  }

  getAuthenticationInfo(): Observable<ITestInfo | ErrorInfo> {

    const url = 'http://localhost:64205/api/Authorize';

    const request: ITestInfo = { name: 'vasko' };

    return this.httpClient.post<ITestInfo>(url, request)
      .do(data => {console.log( 'Service Response' + JSON.stringify(data)); })
      .pipe(
        catchError( err => this.HandleHttpError(err) ),
      );

  }

  getCovers(): Observable<ICover[]> {
    const covers: ICover[] = [
      { id: 10, description: 'Cover 10', price: 100, selected: false },
      { id: 15, description: 'Cover 15', price: 150, selected: true },
      { id: 17, description: 'Cover 17', price: 170, selected: false },
      { id: 20, description: 'Cover 20', price: 200, selected: true },
      { id: 23, description: 'Cover 23', price: 230, selected: false }
    ];
    return of(covers);
  }

  private HandleHttpError( err: HttpErrorResponse ): Observable<ErrorInfo> {
    console.error( err );
    const error = new ErrorInfo();
    error.errorNumber = 100;
    error.message = err.statusText;
    error.friendlyMessage = 'Error occured';
    return ErrorObservable.create( error );
  }
}
