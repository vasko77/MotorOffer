import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Marka } from '../models/Marka';
import { Observable } from 'rxjs/Observable';
import { of } from 'rxjs/internal/observable/of';
import { ICover } from '../models/cover';

@Injectable({
  providedIn: 'root'
})
export class OnlineIssueService {

  private markesUrl = 'api/markes';


  constructor(private httpClient: HttpClient) { }

  getMarkes(): Observable<Marka[]> {
    return this.httpClient.get<Marka[]>(this.markesUrl);
  }

  getCovers(): Observable<ICover[]> {
    const covers: ICover[] = [
      { id: 10, description: "Cover 10", price: 100 },
      { id: 15, description: "Cover 15", price: 150 },
      { id: 17, description: "Cover 17", price: 170 },
      { id: 20, description: "Cover 20", price: 200 },
      { id: 23, description: "Cover 23", price: 230 }
    ]
    return of(covers);
  }
}
