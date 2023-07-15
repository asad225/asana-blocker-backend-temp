import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { TitleService } from '../services/title.service';
import { WData } from '../blocking/blocking.component';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { StorageService } from '../services/storage.service';
import { SitesApiService } from '../services/sites-api.service';
import { FormControl } from '@angular/forms';
import { LoginComponent } from '../auth/login/login.component';
interface Goal{
  _id?:string,
  userId?:string,
  total_time_count?:number,
  total_time_spent?:number,
  difficulty?:string,
  domain:string[]
}
@Component({
  selector: 'ab-goals-automatic',
  templateUrl: './goals-automatic.component.html',
  styleUrls: ['./goals-automatic.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})

export class GoalsAutomaticComponent implements OnInit{
  input = new FormControl('');
  isUpdate=false
  Goal:Goal={
    total_time_count:0,
    difficulty:'medium',
    domain:[]
  }
  
  constructor(
    private _titleService: TitleService,
    private _snackBar: MatSnackBar,
    private _stor: StorageService,
   // private _cdr: ChangeDetectorRef,
    private _siteApiServices : SitesApiService,
    private snackBar: MatSnackBar,
    private _loginComponent:LoginComponent,
  ) {  
    
  }
  ngOnInit(): void {
    this.loadDataFromLocalStorage();
  }
  private loadDataFromLocalStorage(): void {
    chrome.storage.local.get('goal')
      .then(result => {
        this.Goal = {
          _id:result['goal'][0]._id,
          userId:result['goal'][0].userId,
          total_time_count: result['goal'][0].total_time_count,
          total_time_spent: result['goal'][0].total_time_spent,
          difficulty: result['goal'][0].difficulty,
          domain: result['goal'][0].domain
        };
        if(this.Goal._id!=" "){
          this.isUpdate=true
        }
      })
      .catch(error => {
        console.error(error);
      });
  }
  addWebsite(website: string){
    this.Goal.domain.push(website)
    
  }
  updateGoal(){
    chrome.storage.local.get('goal')
      .then(result => {
        let updatedGoal = {
          total_time_count:this.Goal.total_time_count,
          domain:this.Goal.domain
        };
        this._siteApiServices.updateGoal(result['goal'][0]._id,updatedGoal).subscribe((res:any)=>{
          if(res && res.msg === "Goal updated successfully"){
            this._siteApiServices.getGoal(result['goal'][0].userId).subscribe((res:any)=>{
              if(res.msg=='Goal Not Found!'){
                const goal=[{
                  _id:" ",
                  userId:" ",
                  difficulty:'medium',
                  domain:[],
                  total_time_spent:0
                }]
                chrome.storage.local.set({ goal:goal });
              }else{
                const goal = res.goal;
                chrome.storage.local.set({ goal:goal });
              }
              this.snackBar.open('Goal Updated Successfully', 'Close', {
                duration: 2000, 
              });
            })
          }
        });  
      })
      .catch(error => {
        console.error(error);
        this.snackBar.open(error, 'Close', {
          duration: 2000, 
        });
      });
    
    
    
  }

  addGoal(){
    chrome.storage.local.get('userId')
      .then(result => {
        console.log("userid",result)
        let newGoal = {
          userId: result['userId'],
          total_time_count:this.Goal.total_time_count,
          total_time_spent:0,
          is_goal_achieved:false,
          difficulty:'medium',
          domain:this.Goal.domain
        }
        this._siteApiServices.addGoal(newGoal).subscribe((res:any)=>{
          if(res && res.msg === "Goals added successfully"){
            this._siteApiServices.getGoal(result['userId']).subscribe((res:any)=>{
              if(res.msg=='Goal Not Found!'){
                const goal=[{
                  _id:" ",
                  userId:" ",
                  difficulty:'medium',
                  domain:[],
                  total_time_spent:0
                }]
                chrome.storage.local.set({ goal:goal });
              }else{
                const goal = res.goal;
                chrome.storage.local.set({ goal:goal });
              }
              this.snackBar.open('Goal Updated Successfully', 'Close', {
                duration: 2000, 
              });
            })
              this.snackBar.open('Goal Added Successfully', 'Close', {
                duration: 2000, // duration in milliseconds
              });
              this.isUpdate=true
          }
        });
        
      })
      .catch(error => {
        console.error(error);
        this.snackBar.open(error, 'Close', {
          duration: 2000, // duration in milliseconds
        });
      });
    
  }
  deleteSite(website:any){
    this.Goal.domain = this.Goal.domain.filter(item => item !== website);
    
  }  

  resetGoal(){
    chrome.storage.local.get('goal')
      .then(result => {
        let userId=result['goal'][0].userId
        this._siteApiServices.deleteGoal(result['goal'][0]._id).subscribe((res:any)=>{
          if(res && res.msg === "Goal Deleted Successfuly!"){
              chrome.storage.local.remove('goal');
              this.snackBar.open('Goal Deleted Successfully', 'Close', {
                duration: 2000, // duration in milliseconds
              });
              this.Goal={
                _id:" ",
          userId:" ",
          total_time_count:0,
          difficulty:'medium',
          domain:[],
          total_time_spent:0
              }
              this.isUpdate=false
              
        this._loginComponent.getUserGoalData(userId);
        this.ngOnInit()
              
              
          }
        });
      })
      .catch(error => {
        console.error(error);
        this.snackBar.open(error, 'Close', {
          duration: 2000, // duration in milliseconds
        });
      });
  }
}
