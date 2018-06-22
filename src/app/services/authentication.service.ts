import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { IAuthentication } from '../models/authentication';
import { Observable } from 'rxjs/Observable';
import { environment } from '../../environments/environment';
import { ErrorInfo } from '../models/errorInfo';
import { catchError, tap } from 'rxjs/operators';
import { ErrorObservable } from 'rxjs/observable/ErrorObservable';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  public authenticationInfo: IAuthentication;

  constructor(private httpClient: HttpClient) { }

  getAuthenticationInfo(): Observable<IAuthentication | ErrorInfo> {

    const url = environment.urlAuthentication;

    console.log(url);

    return this.httpClient.get<IAuthentication>(url)
      .pipe(
        tap( (data: IAuthentication) => { this.authenticationInfo = data; } ),
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
  }
}
