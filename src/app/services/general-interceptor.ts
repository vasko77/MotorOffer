// tslint:disable-next-line:max-line-length
import { HttpInterceptor, HttpHandler, HttpHeaderResponse, HttpProgressEvent, HttpResponse, HttpSentEvent, HttpUserEvent, HttpRequest, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs/Observable';
import { Injectable } from '@angular/core';

@Injectable()
export class GeneralInterceptor implements HttpInterceptor {
    // tslint:disable-next-line:max-line-length
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpSentEvent | HttpHeaderResponse | HttpProgressEvent | HttpResponse<any> | HttpUserEvent<any>> {

        console.log( 'Passsing through interceptor' );

        const request: HttpRequest<any> = req.clone({
            setHeaders: {
                'Content-Type': 'application/json',
                'Cache-Control': 'no-cache'
            },
            withCredentials: true
        });

        return next.handle( request );
    }
}
