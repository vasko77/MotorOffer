import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OfferInputComponent } from './offer-input/offer-input.component';
import { ApplicationInputComponent } from './application-input/application-input.component';

const routes: Routes = [
  { path: 'offer', component: OfferInputComponent },
  { path: 'application', component: ApplicationInputComponent },
  { path: '', redirectTo: 'offer', pathMatch: 'full' },
  { path: '**', redirectTo: '', pathMatch: 'full' }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
