import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OfferInputComponent } from './offer-input/offer-input.component';

const routes: Routes = [
  { path: 'offer', component: OfferInputComponent },
  { path: '', redirectTo: 'offer', pathMatch: 'full' },
  { path: '**', redirectTo: '', pathMatch: 'full' }];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
