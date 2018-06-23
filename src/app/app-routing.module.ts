import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OfferInputComponent } from './offer-input/offer-input.component';
import { ApplicationInputComponent } from './application-input/application-input.component';
import { ApplicationSuccessComponent } from './application-success/application-success.component';
import { OfferSuccessComponent } from './offer-success/offer-success.component';

const routes: Routes = [
  { path: 'offer', component: OfferInputComponent },
  { path: 'offer-success', component: OfferSuccessComponent },
  { path: 'application', component: ApplicationInputComponent },
  { path: 'application-success/:proposalNumber', component: ApplicationSuccessComponent },
  { path: '', redirectTo: 'offer', pathMatch: 'full' },
  { path: '**', redirectTo: '', pathMatch: 'full' }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
