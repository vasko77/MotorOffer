import { Injectable } from '@angular/core';
import { InMemoryDbService } from 'angular-in-memory-web-api';
import { Marka } from '../models/Marka';


@Injectable({
  providedIn: 'root'
})
export class InMemoryDataService implements InMemoryDbService {

  createDb() {
    const markes: Marka[] = 
    [
      { id: 1, description: "VW"},
      { id: 2, description: "Audi"}
    ];

    return { markes };
  }
  
}
