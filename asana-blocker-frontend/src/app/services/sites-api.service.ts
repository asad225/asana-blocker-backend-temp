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

  updateGoal(goalId:any,data:any): Observable<any>{
    //body should contain updated spending time
    return this.http.put(this.apiUrl + `/goal/update/${goalId}`,data);
  }
  deleteGoal(data:any):Observable<any>{
    //body should contain goal id to be deleted
    return this.http.delete(this.apiUrl + `/deleteGoal`,data);
  }
  addGoal(data:any):Observable<any>{
    //body should contain complete goal object
    return this.http.post(this.apiUrl + `/addGoals`,data);
  }
  addBlockSite(data:any): Observable<any>{
    return this.http.post(this.apiUrl + '/block/site', data);
  }
  getGoal(userId:any):Observable<any>{
    
    return this.http.get(this.apiUrl+`/getGoalUserId/${userId}`)
  }

  getBlockSite(userId:any): Observable<any>{
    return this.http.get(this.apiUrl + `/block/sites/${userId}`);
  }

  deleteBlockSite(siteId:any): Observable<any>{
    return this.http.delete(this.apiUrl + `/blockSite/${siteId}`);
  }
}
