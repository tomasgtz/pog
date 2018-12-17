import { Injectable } from '@angular/core';
import { LineItem } from './line-item.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, catchError } from 'rxjs/operators';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CheckInventoryService {
    
  constructor(private http: HttpClient) { }


  checkInventory(itemsSearched: LineItem[]) {
    
    let params = JSON.stringify( itemsSearched );

    let headers = new HttpHeaders().set('Content-Type','application/json');

    return this.http.post('http://192.168.1.122:82/compras/pog/index.php/saveExcel', params, {headers: headers})
      
         .pipe(map((response: Response) => {
                   
          return response;
          
      }), catchError(error => this.handleError()));

  }

  private handleError() {
    
    return of("error");
  }
  
}
