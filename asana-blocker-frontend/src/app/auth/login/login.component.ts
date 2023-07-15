import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { SitesApiService } from 'src/app/services/sites-api.service';
import { StorageService } from 'src/app/services/storage.service';


@Component({
  selector: 'ab-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  formData: any = {};


  constructor(private dialog: MatDialog,private authService: AuthService, private router: Router, private storageService:StorageService,
    private _siteApiServices:SitesApiService) {}

  
  submitForm() {
    this.authService.userLogin(this.formData).subscribe((data: any) => {
      console.log(data)
      this.router.navigate(['/profile']);
      this.storageService.saveData('userData', data.user);
      this.storageService.saveData('authToken', data.token);
      
      //saving user id and goal to storage
      chrome.storage.local.set({userId:data.user._id})
      this.getUserGoalData(data.user._id)
      
    })
  }

  getUserGoalData(userId:string){
    this._siteApiServices.getGoal(userId).subscribe((res:any)=>{
      if(res.msg=='Goal Not Found!'){
        const goal=[{
          _id:" ",
          userId:" ",
          total_time_count:0,
          difficulty:'medium',
          domain:[],
          total_time_spent:0
        }]
        console.log('goal when user user dont hve goal',goal)
        chrome.storage.local.set({ goal:goal });
      }else{
        const goal = res.goal;
        console.log('when user have goal',goal)
      chrome.storage.local.set({ goal:goal });
      }
      
      
    })
  }


}
