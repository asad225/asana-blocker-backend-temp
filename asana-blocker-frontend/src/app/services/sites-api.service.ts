import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class SitesApiService {

  apiUrl = 'http://localhost:3333/api/v1';

  constructor(private http : HttpClient) { }

  addGoalSite(data:any): Observable<any>{
   return this.http.post(this.apiUrl + '/productive/site', data);
  }

  getGoalSite(userId:any): Observable<any>{
    return this.http.get(this.apiUrl + `/productive/sites/${userId}`);
  }

  deleteGoalSite(siteId:any): Observable<any>{
    return this.http.delete(this.apiUrl + `/goodSite/${siteId}`);
  }

  addBlockSite(data:any): Observable<any>{
    return this.http.post(this.apiUrl + '/block/site', data);
  }

  getBlockSite(userId:any): Observable<any>{
    return this.http.get(this.apiUrl + `/block/sites/${userId}`);
  }

  deleteBlockSite(siteId:any): Observable<any>{
    return this.http.delete(this.apiUrl + `/blockSite/${siteId}`);
  }
}
