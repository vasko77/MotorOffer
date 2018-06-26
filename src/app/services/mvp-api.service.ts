import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import { ErrorInfo } from '../models/errorInfo';
import { environment } from '../../environments/environment';
import { IQuotationInfo } from '../models/mvp-contracts/quotation-info';
import { HttpErrorResponse, HttpClient } from '@angular/common/http';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';
import { EmptyObservable } from 'rxjs/observable/EmptyObservable';
import { catchError, tap } from 'rxjs/operators';
import { IContactInfo } from '../models/mvp-contracts/contact-info';
import { of } from 'rxjs/observable/of';

@Injectable({
  providedIn: 'root'
})
export class MvpApiService {

  public plateNo: string;

  private _quotationInfo: IQuotationInfo;
  get quotationInfo(): IQuotationInfo {
    return this._quotationInfo;
  }

  constructor(private httpClient: HttpClient) {
  }

  getQuotation(plateNo: string): Observable<IQuotationInfo | ErrorInfo> {

    const url = environment.urlMvpQuotation + plateNo;

    console.log(url);
    const emptyQuotation: IQuotationInfo = undefined;
    return this.httpClient.get<IQuotationInfo>(url)
      .pipe(
        catchError(err => {
          console.log(err.status);
          if (err.status !== 404) {
            return this.HandleHttpError(err);
          } else {
            return of(emptyQuotation) // EmptyObservable();
          }
        })
      );
  }

  postQuotation(quotation: IQuotationInfo): Observable<IQuotationInfo | ErrorInfo> {

    const url = environment.urlMvpQuotation;

    console.log(url);

    return this.httpClient.post<IQuotationInfo>(url, quotation)
      .pipe(
        tap( (data: IQuotationInfo) => { this._quotationInfo = quotation; } ),
        catchError(err => this.HandleHttpError(err) )
      );
  }

  getContact(plateNo: string): Observable<IContactInfo | ErrorInfo> {

    const url = environment.urlMvpContact + plateNo;

    console.log(url);
    const emptyQuotation: IQuotationInfo = undefined;
    return this.httpClient.get<IContactInfo>(url)
      .pipe(
        catchError(err => {
          console.log(err.status);
          if (err.status !== 404) {
            return this.HandleHttpError(err);
          } else {
            return of(emptyQuotation); // new EmptyObservable();
          }
        })
      );
  }

  postContact(contact: IContactInfo): Observable<IContactInfo | ErrorInfo> {

    const url = environment.urlMvpContact;

    console.log(url);

    return this.httpClient.post<IContactInfo>(url, contact)
      .pipe(
        // tap( (data: IContactInfo) => { this._quotationInfo = quotation; } ),
        catchError(err => this.HandleHttpError(err) )
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
