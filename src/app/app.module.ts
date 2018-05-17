import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { registerLocaleData } from '@angular/common';
import localeEl from '@angular/common/locales/el';
registerLocaleData(localeEl, 'el');

import { DateInputsModule } from '@progress/kendo-angular-dateinputs';
import { InputsModule } from '@progress/kendo-angular-inputs';

import { IntlModule } from '@progress/kendo-angular-intl';
import '@progress/kendo-angular-intl/locales/el/all';
import '@progress/kendo-angular-intl/locales/el/calendar'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { BodyComponent } from './body/body.component';

import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { OfferInputComponent } from './offer-input/offer-input.component';

import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { InMemoryDataService }  from './services/in-memory-data.service';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    BodyComponent,
    OfferInputComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    DateInputsModule,
    InputsModule,
    IntlModule,
    HttpClientInMemoryWebApiModule.forRoot( InMemoryDataService, { dataEncapsulation: false } ),
    BrowserAnimationsModule
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'el' }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
