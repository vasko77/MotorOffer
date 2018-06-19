import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { registerLocaleData } from '@angular/common';
import localeEl from '@angular/common/locales/el';
registerLocaleData(localeEl, 'el');

import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { InputsModule } from '@progress/kendo-angular-inputs';

import { NgBusyModule, BusyConfig } from 'ng-busy';
import { ToastrModule } from 'ngx-toastr';

import { IntlModule } from '@progress/kendo-angular-intl';
import '@progress/kendo-angular-intl/locales/el/all';
import '@progress/kendo-angular-intl/locales/el/calendar';
import { TooltipModule } from '@progress/kendo-angular-tooltip';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { BodyComponent } from './body/body.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { OfferInputComponent } from './offer-input/offer-input.component';

// import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
// import { InMemoryDataService } from './services/in-memory-data.service';

import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { GeneralInterceptor } from './services/general-interceptor';
import { ApplicationInputComponent } from './application-input/application-input.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    BodyComponent,
    OfferInputComponent,
    ApplicationInputComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    DateInputsModule,
    InputsModule,
    IntlModule,
    NgBusyModule,
    TooltipModule,
    // HttpClientInMemoryWebApiModule.forRoot( InMemoryDataService, { dataEncapsulation: false } ),
    BrowserAnimationsModule,
    ToastrModule.forRoot({
      timeOut: 10000,
      positionClass: 'toast-bottom-center',
      preventDuplicates: true
    })
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'el' },
    { provide: HTTP_INTERCEPTORS, useClass: GeneralInterceptor, multi: true }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
