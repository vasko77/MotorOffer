// tslint:disable-next-line:max-line-length
import { HttpInterceptor, HttpHandler, HttpHeaderResponse, HttpProgressEvent, HttpResponse, HttpSentEvent, HttpUserEvent, HttpRequest, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';

@Injectable()
export class GeneralInterceptor implements HttpInterceptor {
    // tslint:disable-next-line:max-line-length
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpSentEvent | HttpHeaderResponse | HttpProgressEvent | HttpResponse<any> | HttpUserEvent<any>> {

        const request: HttpRequest<any> = req.clone({
            setHeaders: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Cache-Control': 'no-cache',
                // tslint:disable-next-line:max-line-length
                // Authorization: 'NTLM TlRMTVNTUAADAAAAGAAYAGwAAAAYABgAhAAAABIAEgBIAAAAEgASAFoAAAAAAAAAbAAAAAAAAACcAAAABYKIogUBKAoAAAAPRQBGAEcASQBOAFMALgBHAFIAbQBvAHMAcwBhAGQAbQBpAG4A6dtgjcmEMb4AAAAAAAAAAAAAAAAAAAAAd7a3WnUGiRak4O3GUnxIPh7gbyTS0ayT'
            },
            withCredentials: true
        });

        return next.handle( request );
    }
}
