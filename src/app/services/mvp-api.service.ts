import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ErrorInfo } from '../models/errorInfo';
import { environment } from '../../environments/environment';
import { IQuotationInfo } from '../models/mvp-contracts/quotation-info';
import { HttpErrorResponse, HttpClient } from '@angular/common/http';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MvpApiService {

  constructor(private httpClient: HttpClient) {
  }

  getQuotation(plateNo: string): Observable<IQuotationInfo | ErrorInfo> {

    const url = environment.urlGetMvpQuotation + plateNo;

    console.log( url );

    return this.httpClient.get<IQuotationInfo>(url)
      .pipe(
         catchError(err => this.HandleHttpError(err))
    );
  }

  private HandleHttpError(err: HttpErrorResponse): Observable<ErrorInfo> {
    console.error('Logged by Vasko: ' + JSON.stringify(err));
    const error = new ErrorInfo();
    error.errorNumber = 100;
    error.message = err.statusText;
    error.friendlyMessage = 'Error occured';
    return ErrorObservable.create(error);
  }}
