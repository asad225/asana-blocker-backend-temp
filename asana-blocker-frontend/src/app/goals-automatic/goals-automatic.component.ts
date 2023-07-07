import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { TitleService } from '../services/title.service';
import { WData } from '../blocking/blocking.component';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { StorageService } from '../services/storage.service';
import { SitesApiService } from '../services/sites-api.service';
import { FormControl } from '@angular/forms';
import { TimeTrackingService } from '../time-tracking.service';

@Component({
  selector: 'ab-goals-automatic',
  templateUrl: './goals-automatic.component.html',
  styleUrls: ['./goals-automatic.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})

export class GoalsAutomaticComponent implements OnInit{
  input = new FormControl('');
  spendingTime = new FormControl('Add Time')
  actionLevelControl = new FormControl('medium');
  displayedColumns: string[] = ['name', 'actions'];
  dataSource: WData[] = [];
  _getGoalSiteList: any[]=[];
  wbRx = /^((https?|ftp|smtp):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/;
  dd!: MatTableDataSource<any>;
  userInfo = JSON.parse(JSON.stringify(localStorage.getItem('userData')));
  _getUserinfo = JSON.parse(this.userInfo);
  productiveSiteArray: any[] = [];
  Goal={
    userId:null,
    total_time_count:0,
    total_time_spent:0,
    difficulty:'easy',
    domain:[]
  }
  
  constructor(
    private _timeTrackingService : TimeTrackingService,
    private _titleService: TitleService,
    private _activatedRoute: ActivatedRoute,
    private _snackBar: MatSnackBar,
    private _stor: StorageService,
   // private _cdr: ChangeDetectorRef,
    private _siteApiServices : SitesApiService
  ) {  
    
  }
  
  ngOnInit(){  
    
    /*this._activatedRoute.data.subscribe((response: any) => {
      if (response && response.data) {
        this.fillInTheItems(response.data);
      }
      // this._cdr.detectChanges();
    });
    this.setVariables();
    this._titleService.title$.next('Goals > Automatic');
    this._cdr.detectChanges();*/
    this._siteApiServices.getGoal(localStorage.getItem('userId')).subscribe((res:any)=>{
      localStorage.setItem('Goal',JSON.stringify(res.goal))
      const goal = res.goal;
      this.Goal = {
        userId: goal[0].userId,
        total_time_count: goal[0].total_time_count,
        total_time_spent: goal[0].total_time_spent,
        difficulty: goal[0].difficulty,
        domain: goal[0].domain
      };     
      console.log('domain:',this.Goal.domain) 
      this.productiveSiteArray=this.Goal.domain
    console.log("product: ",this.productiveSiteArray)
    localStorage.setItem('productiveWebsite',JSON.stringify(this.productiveSiteArray))
    })
    
  }
  addWebsite(website: string){
    let websiteUrl;
    if(this.wbRx.test(website)){
      websiteUrl=website
    }
    websiteUrl = `https:///${website}.com`;
    this.productiveSiteArray.push(websiteUrl)
    localStorage.setItem('productiveWebsite',JSON.stringify(this.productiveSiteArray))
  }

  getGoalSite(){
    this._siteApiServices.getGoalSite(this._getUserinfo._id).subscribe((res:any)=>{
      console.log('res data from goal sire: ',res.data)
      this.productiveSiteArray = res.data;
      console.log(this.productiveSiteArray);
     });
  }
  

  async setVariables(): Promise<void> {
    const actionLevel = await this._stor.get('actionLevel');
    this.actionLevelControl.setValue(actionLevel);
  }

  handleActionLevelChange(): void {
    this._stor.set({
      'actionLevel': this.actionLevelControl.value
    });
  }
  addGoal(){
    this._timeTrackingService.startTimer('google.com')
    let data = {
      userId: this._getUserinfo._id,
      total_time_count:this.Goal.total_time_count,
      total_time_spent:0,
      is_goal_achieved:false,
      difficulty:this.Goal.difficulty,
      domain:this.productiveSiteArray
    }
    this._siteApiServices.addGoal(data).subscribe((res:any)=>{
      if(res && res.msg === "Goals added successfully"){
      this._stor.saveData('Goal',JSON.stringify(data));
      localStorage.setItem('Goal',JSON.stringify(data))
      this.productiveSiteArray.forEach(website => {
        const data = {
          userId: this._getUserinfo._id,
          method: this.actionLevelControl.value,
          site: website,
          goalId:res.result._id
        };
        this._siteApiServices.addGoalSite(data).subscribe((res: any) => {
          if (res && res.msg === "data added successfully") {
          }
        });
      });

      }
    });  
  }
  deleteSite(website:any){
    this.productiveSiteArray = this.productiveSiteArray.filter(item => item !== website);
    localStorage.setItem('productiveWebsite',JSON.stringify(this.productiveSiteArray))
    //delete if goal exist
  }  
}
