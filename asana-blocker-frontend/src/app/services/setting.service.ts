import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SettingService {

  constructor(private http: HttpClient) { }
  authUrl = 'https://asana-blocker212.onrender.com/api/v1';
  // authUrl = 'http://localhost:3333/api/v1';
  usermethodUrl = this.authUrl + '/method';
  usertextUrl = this.authUrl + '/text';
  userCheckIntervalUrl = this.authUrl + '/CheckInterval';

  user(userData: any) {
    return this.http.post(this.usermethodUrl, userData)
  }

  userLogin(userData: any) {
    return this.http.post(this.usertextUrl, userData)
  }
  updateUser(userData: any) {
    return this.http.put(this.usermethodUrl + '/' + userData.userId, userData)
  }
  getMDataByUserId(userData: any) {
    return this.http.get(this.usermethodUrl + '?userId=' + userData)
  }
  getTDataByUserId(userData: any) {
    return this.http.get(this.usertextUrl + '?userId=' + userData)
  }
  getCheckIntervalDataByUserId(userData: any) {
    return this.http.get(this.usertextUrl + '?userId=' + userData)
  }
}
