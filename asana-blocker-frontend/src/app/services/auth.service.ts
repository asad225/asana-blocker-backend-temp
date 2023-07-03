import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  authUrl = 'https://asana-blocker212.onrender.com/api/v1';
  // authUrl = 'http://localhost:3333/api/v1';
  userRegisterUrl = this.authUrl + '/userSignup';
  userLoginrUrl = this.authUrl + '/userLogin';
  userupdateUrl = this.authUrl + '/user';

  userSignUp(userData: any) {
    return this.http.post(this.userRegisterUrl, userData)
  }

  userLogin(userData: any) {
    return this.http.post(this.userLoginrUrl, userData)
  }
  updateUser(userData: any) {
    return this.http.put(this.userupdateUrl + '/' + userData.userId, userData)
  }
  getUserById(userData: any) {
    return this.http.get(this.userupdateUrl + '/' + userData)
  }


}
