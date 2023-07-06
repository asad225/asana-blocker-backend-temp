import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { TitleService } from '../services/title.service';
import { WData } from '../blocking/blocking.component';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';
import { StorageService } from '../services/storage.service';
import { SitesApiService } from '../services/sites-api.service';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'ab-goals-automatic',
  templateUrl: './goals-automatic.component.html',
  styleUrls: ['./goals-automatic.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})

export class GoalsAutomaticComponent implements OnInit {
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
    private _titleService: TitleService,
    private _activatedRoute: ActivatedRoute,
    private _snackBar: MatSnackBar,
    private _stor: StorageService,
   // private _cdr: ChangeDetectorRef,
    private _siteApiServices : SitesApiService
  ) {  
    this._siteApiServices.getGoal(localStorage.getItem('userId')).subscribe((res:any)=>{
      localStorage.setItem('Goal',JSON.stringify(res.goal))
      const goal = res.goal;
      this.Goal = {
        userId: goal.userId,
        total_time_count: goal.total_time_count,
        total_time_spent: goal.total_time_spent,
        difficulty: goal.difficulty,
        domain: goal.domain
      };      
    })
    this.productiveSiteArray=this.Goal.domain
    localStorage.setItem('productiveWebsite',JSON.stringify(this.productiveSiteArray))
    this.getGoalSite();
  }

  async ngOnInit(): Promise<void> {  
    
    this._activatedRoute.data.subscribe((response: any) => {
      if (response && response.data) {
        this.fillInTheItems(response.data);
      }
      // this._cdr.detectChanges();
    });
    this.setVariables();
    this._titleService.title$.next('Goals > Automatic');
    // this._cdr.detectChanges();
  }
  addWebsite(website: string){
    let websiteUrl;
    if(this.wbRx.test(website)){
      websiteUrl=website
    }
    websiteUrl = `https://${website}.com`;
    this.productiveSiteArray.push(websiteUrl)
    localStorage.setItem('productiveWebsite',JSON.stringify(this.productiveSiteArray))
    let data = {
      userId: this._getUserinfo._id,
      method: this.actionLevelControl.value, 
      site : websiteUrl
    }
    this._siteApiServices.addGoalSite(data).subscribe((res:any)=>{
      if(res && res.msg === "data added successfully"){
        this.getGoalSite()
      }
    });

  }

  getGoalSite(){
    this._siteApiServices.getGoalSite(this._getUserinfo._id).subscribe((res:any)=>{
      console.log('res data from goal sire: ',res.data)
      this.productiveSiteArray = res.data;
      console.log(this.productiveSiteArray);
     });
  }
  
  time(event:any){
    this.spendingTime.setValue(event.target.value);
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
    console.log("add goal")
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
      }
    });
    
  }
  add(website: string): void {
    if (this.dataSource.find(d => d.name.toLowerCase() === website.toLocaleLowerCase())) {
      this.openSnackBar(`This website is already added in the list`, 'close');
    } else if (website && !this.dataSource.find(d => d.name.toLowerCase() === website.toLocaleLowerCase()) &&
      this.wbRx.test(website)) {
      this.addItemToData(website);
      let data = {
      userId: this._getUserinfo._id,
      method: this.actionLevelControl.value, 
      site : this.input.value 
    }
    this.productiveSiteArray.push(this.input.value??'')
    this._siteApiServices.addGoalSite(data).subscribe((res:any)=>{
      if(res && res.msg === "data added successfully"){
        this.getGoalSite()
      }
    });
      this.input.setValue('');
    //  this._cdr.detectChanges();
      this.setDataToStorage();
      this._stor.pushToHistory({
        action: 'Automatic(good) Website add',
        description: website
      });
    }
  }

  deleteSite(_id:any){
    this._siteApiServices.deleteGoalSite(_id).subscribe((res:any)=>{
      if(res.message === "Domain deleted successfully!"){
        this.getGoalSite();
      }
    });
  }

  remove(index: number): void {
    const website = this.dataSource.splice(index, 1)[0];
    this.dd = new MatTableDataSource(this.dataSource);
  //  this._cdr.detectChanges();
    this.setDataToStorage();
    this._stor.pushToHistory({
      action: 'Automatic(good) Website remove',
      description: website.name
    });
  }

  fillInTheItems(data: WData[]): void {
    this.dataSource = [];
    this.dd = new MatTableDataSource(this.dataSource);
 //   this._cdr.detectChanges();
    Object.values(data || {}).forEach((val: WData) => {
      this.addItemToData(val.name);
    });
  }

  addItemToData(name: string, position: 'unshift' | 'push' = 'push'): void {
    if (position === 'unshift') this.dataSource.unshift({name: name, actions: {delete: true}});
    else this.dataSource.push({name: name, actions: {delete: true}});
    this.dd = new MatTableDataSource(this.dataSource);
    //this._cdr.detectChanges();
  }

  setDataToStorage(): void {
    let buffArr: any;
    if (!this.dataSource || !this.dataSource.length) {
      buffArr = [];
    } else {
      buffArr = Object.values(this.dataSource);
    }
    console.log("buffar : ",buffArr)
    this._stor.set({
      automaticWebsites: buffArr
    });
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }
  
}
