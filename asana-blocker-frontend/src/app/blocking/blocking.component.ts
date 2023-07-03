import { AfterViewInit, ChangeDetectionStrategy, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute } from '@angular/router';
import { StorageService } from '../services/storage.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog } from '@angular/material/dialog';
import { UnblockStringsComponent } from './unblock-strings/unblock-strings.component';
import { TitleService } from '../services/title.service';
import { BehaviorSubject, ReplaySubject, takeUntil } from 'rxjs';
import { BlockingsResolverService } from '../services/blocking-resolver.service';
import { SitesApiService } from '../services/sites-api.service';

export interface WData {
  name: string;
  actions?: {
    delete: boolean
  };
}
export type Tab = 'blocking' | 'exceptions';

@Component({
  selector: 'ab-blocking',
  templateUrl: './blocking.component.html',
  styleUrls: ['./blocking.component.scss'],
  // changeDetection: ChangeDetectionStrategy.OnPush
})
export class BlockingComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('websiteInput') websiteInput!: ElementRef;
  input = new FormControl('');
  wildSite = new FormControl(false);
  interval = new FormControl(0.2, Validators.required);
  displayedColumns: string[] = ['name', 'actions'];
  timeleft: any = 'N/A';
  dataSource: WData[] = [];
  dd!: MatTableDataSource<any>;
  wbRx = /^((https?|ftp|smtp):\/\/)?(www.)?[a-z0-9]+(\.[a-z]{2,}){1,3}(#?\/?[a-zA-Z0-9#]+)*\/?(\?[a-zA-Z0-9-_]+=[a-zA-Z0-9-%]+&?)?$/;
  isBlocking = false;
  selectedTab$ = new BehaviorSubject<Tab>('blocking');
  selectedTab: Tab = 'blocking';
  wildExists = false;
  rewardMethod!: 'manual' | 'automatic';
  expectionButton: any;
  _getBlockSiteList: any[] = [];
 
  userInfo = JSON.parse(JSON.stringify(localStorage.getItem('userData')));
  _getUserinfo = JSON.parse(this.userInfo);

  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);

  constructor(
    private _cdr: ChangeDetectorRef,
    private _stor: StorageService,
    private _activatedRoute: ActivatedRoute,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private _titleService: TitleService,
    private _blockService : BlockingsResolverService,
    private _siteApiServices : SitesApiService
  ) {}

  async ngOnInit(): Promise<void> {
    this.getBlockSite();
    this._activatedRoute.data.subscribe((response: any) => {
      if (response && response.data) {
        this.fillInTheItems(response.data);
      }
      
      this.seeBaackgroundProcessWorking();
      this._cdr.detectChanges();
    });
    this._titleService.title$.next('Blockings');
    this.rewardMethod = await this._stor.get('rewardMethod');
    this.handleTabChangeSubscription();
    this.handleWildSiteSubscription();
  }

  handleWildSiteSubscription(): void {
    this.wildSite.valueChanges.subscribe((res) => {
     this.expectionButton = res;
      if (res) {
        this.addItemToData('*', 'unshift');
        this.setDataToStorage();
        this._stor.pushToHistory({
          action: 'Website add',
          description: '*'
        });
      } else {
        this.remove(0);
      }
    });

    if (this.websiteExistsInCurrentData('*')) this.wildSite.setValue(true, {emitEvent: false});
   
  }

  fillInTheItems(data: WData[]): void {
    this.dataSource = [];
    this.dd = new MatTableDataSource(this.dataSource);
    this._cdr.detectChanges();
    Object.values(data || {}).forEach((val: WData) => {
      this.addItemToData(val.name);
    });
  }

  handleTabChangeSubscription(): void {
    this.selectedTab$.pipe(takeUntil(this.destroyed$)).subscribe((result: Tab) => {
      this.selectedTab = result;
      this.handleTabChange();
    });
  }

  handleTabSelect(tab: any, input: HTMLInputElement): void {
    this.selectedTab$.next(tab.index === 0 ? 'blocking' : 'exceptions');
    input.focus();
  }

  onChangeBlockSite(event:any){
    if(event.checked == true){
       let data ={
        userId: this._getUserinfo._id,
        site : "*"
       }
      this.addBlockSite(data);
    }else{
      let _getfilterData  = this._getBlockSiteList.filter(e=> e.site === "*");
      if(_getfilterData && _getfilterData.length > 0){
       this.deleteBlockSite(_getfilterData[0]._id);
      }
    }
  }

  deleteBlockSite(_id:any){
    this._siteApiServices.deleteBlockSite(_id).subscribe((res:any)=>{
    if(res.message === "Domain deleted successfully!"){
      console.log(this._getBlockSiteList)
      this.getBlockSite();
    }
    });
  }

  addBlockSite(data:any){
    this._siteApiServices.addBlockSite(data).subscribe((res:any)=>{
      if(res.msg === "data added successfully"){
       this.getBlockSite();
      }
     });
  }

  getBlockSite(){
    this._siteApiServices.getBlockSite(this._getUserinfo._id).subscribe((res:any)=>{
      this._getBlockSiteList = res.data;
     });
  }

  async blockedWebsites(): Promise<WData[]> {
    return await this._stor.get('blockedWebsites'); 
  }

  async exceptionWebsites(): Promise<WData[]> {
    return await this._stor.get('exceptionWebsites'); 
  }
  
  async handleTabChange(): Promise<void> {
    const dataPromise = this.selectedTab === 'blocking' ?
        this.blockedWebsites() :
        this.exceptionWebsites();

    dataPromise.then((res: WData[]) => {
      this.fillInTheItems(res || {});
    });
  }

  async seeBaackgroundProcessWorking(): Promise<void> {
    let bgLifetime = await this._stor.get('bgLifeTime');
    let isBlocking = await this._stor.get('isBlocking');

    if (isBlocking && bgLifetime) {
        let difference = new Date().getTime() - bgLifetime;
        let differenceInSeconds = Math.floor(difference/1000/60);

        console.log(`Diff: ${difference}`);
        
        if (differenceInSeconds > 1) {
          this.isBlocking = false;
        } else {
          this.isBlocking = true;
        }
    }
    this._cdr.detectChanges();
  }

  async start(): Promise<void> {
    const apiToken = await this._stor.get('apiToken');
    const taskId = await this._stor.get('taskId');
    const assigneeId = await this._stor.get('assigneeIdBg');
    const asanaTaskCheckInterval = await this._stor.get('asanaTaskCheckIntervalBg') || 0.02;
    const rewardMethod = await this._stor.get('rewardMethod');
    const automaticWebsites = await this._stor.get('automaticWebsites');
    console.log("automaticWebsites :  " ,automaticWebsites)
    console.log("rewardMethod :  " ,rewardMethod)

    if (rewardMethod === 'manual') {
      if (!apiToken || !taskId || !assigneeId) {
        this.openSnackBar('Please fill in all the credentials (Goals > Manual)', 'close');
        return;
      }
    } else {
      if (!automaticWebsites || !automaticWebsites.length) {
        this.openSnackBar('Please fill in the websites for automatic rewards (Goals > Automatic)', 'close');
        return;
      }
    }

    if (!this.interval.value && this.rewardMethod !== 'automatic') {
      this.openSnackBar('Fill in the interval in minutes', 'Close');
      this.interval.markAsTouched();
    } else {
      this.blockedWebsites().then((res: WData[]) => {
        if (!res || !Object.values(res) || !Object.values(res).length) {
          this.openSnackBar('Fill in the websites to block', 'close');
          return;
        }
        
        this._stor.set({
          blockedWebsites: Object.values(res)
        });

        setTimeout(() => {
          if (rewardMethod === 'manual') {
            this.handleManualBlocking(assigneeId, res, asanaTaskCheckInterval);
          } else {
            this.handleAutomaticBlocking();
          }
        }, 300);
  
        this._stor.pushToHistory({
          action: 'Blocking start',
          description: Object.values(res)
        });
        this.openSnackBar('Started blocking!', 'close');
        this._stor.set({
          isBlocking: true
        });
        this.isBlocking = true;
        this._cdr.detectChanges();
      });
    }
    this._cdr.detectChanges();
  }

  handleManualBlocking(assigneeId: any, websites: any, asanaTaskCheckInterval: any): void {
    chrome.runtime.sendMessage({
      token: this._stor.apiToken,
      taskId: this._stor.taskId,
      assigneeId: assigneeId,
      submittedWebsites: Object.values(websites),
      intervalInMinutes: this.interval.value,
      asanaTaskCheckInterval: +asanaTaskCheckInterval
    });
  }

  handleAutomaticBlocking(): void {
    chrome.runtime.sendMessage({
      runAutomaticOnCurrentWindow: true
    });
  }

  llog(): void {
    console.log('clicked on stop button');
  }
  
  async stop(): Promise<void> {
    console.log('Monitor blocking stop in stop function');
    
    const randomText = await this._stor.get('randomText');
    if (randomText?.onoff) {
      const len = randomText.len;
      this.openModal(len);
    } else {
      this.stopBlocking();
      this._stor.set({
        isBlocking: false
      });
    }
  }

  async stopBlocking(): Promise<void> {
    console.log('Monitor blocking stop in stopBlocking function');
    this.isBlocking = false;
    chrome.runtime.sendMessage({
      stop: true
    });
    this._stor.set({
      bgLifeTime: new Date('10/01/1995').getTime()
    });

    this.openSnackBar('Blocking stopped!', 'close');

    this._stor.pushToHistory({
      action: 'Blocking stop',
      description: 'Websites are not being blocked'
    });
    this._stor.remove('initialTimeleft');
    this._stor.remove('tick');
    this._cdr.detectChanges();
  }

  addWildWebsite(): void {

  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }

  add(website: string): void {
    const reverseWebsitesDaraProm = this.selectedTab !== 'blocking' ?
        this.blockedWebsites() :
        this.exceptionWebsites();
    reverseWebsitesDaraProm.then((res: WData[]) => {
      if (Object.values(res || {}).find(d => d.name.toLowerCase() === website.toLocaleLowerCase())) {
        this.openSnackBar(`This website is already added in ${this.selectedTab === 'blocking' ? 'exceptions' : 'blockings'} list`, 'close');
      } else if (website && !this.dataSource.find(d => d.name.toLowerCase() === website.toLocaleLowerCase()) &&
          this.wbRx.test(website)) {
        this.addItemToData(website);
        let data = {
          userId: this._getUserinfo._id,
          site : this.input.value 
        }
        this.addBlockSite(data);
        this.input.setValue('');
        this._cdr.detectChanges();
        this.setDataToStorage();
        this._stor.pushToHistory({
          action: 'Website add',
          description: website
        });
      }
    });
  }

  websiteExistsInCurrentData(websiteName: string): boolean {
    return !!this.dataSource.find(d => d.name === websiteName);
  }

  addItemToData(name: string, position: 'unshift' | 'push' = 'push'): void {
    if (position === 'unshift') this.dataSource.unshift({name: name, actions: {delete: true}});
    else this.dataSource.push({name: name, actions: {delete: true}});
    if (name === '*') this.wildExists = true;
    this.dd = new MatTableDataSource(this.dataSource);
    this._cdr.detectChanges();
  }

  remove(index: number): void {
    const website = this.dataSource.splice(index, 1)[0];
    if (website.name === '*') {
      this.expectionButton = false;
      this.wildExists = false;
      this.wildSite.setValue(false, {emitEvent: false});
    }
    this.dd = new MatTableDataSource(this.dataSource);
    this._cdr.detectChanges();
    this.setDataToStorage();
    this._stor.pushToHistory({
      action: 'Website remove',
      description: website.name
    });
  }

  setDataToStorage(): void {
    this._stor.set({
      [this.selectedTab === 'blocking' ? 'blockedWebsites' : 'exceptionWebsites']: {
        ...this.dataSource
      }
    });
  }
  
  getHours(): any {
    this._stor.get('timeleft').then((result) => {
      this._stor.get('initialTimeleft').then((initResult) => {
        if (result && result > -1) {
          this.timeleft = +result;
        } else if (initResult) {
          this.timeleft = initResult;
        } else {
          this.timeleft = 0;
        }
      });
      this._cdr.detectChanges();
    });

    return this.formatTime(this.timeleft, 'h');
  }

  getMinutes(): any {
    return this.formatTime(this.timeleft, 'm');
  }

  getSeconds(): any {
    return this.formatTime(this.timeleft, 's');
  }

  formatTime(seconds: number, t: string): string {
    if (!this.isBlocking || !seconds || seconds === -1) {
      return '00';
    }

    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;
  
    const formattedHours = hours.toString().padStart(2, '0');
    const formattedMinutes = minutes.toString().padStart(2, '0');
    const formattedSeconds = remainingSeconds.toString().padStart(2, '0');
  
    if (t === 'h') return formattedHours;
    if (t === 'm') return formattedMinutes;
    if (t === 's') return formattedSeconds;
    return '';
  }

  openModal(len: any): void {
    const dialogRef = this.dialog.open(UnblockStringsComponent, {
      data: {
        len
      },
      minWidth: '380px',
      width: '70vw',
    });
    

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.stopBlocking();
      }
    });
  }

  ngAfterViewInit(): void {
    this.websiteInput.nativeElement.focus();
  }

  ngOnDestroy(): void {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}

// credentials: 1/1204393040643594:f77a658d3086c9294273d63262c8f184
// taskId: 1204393106861173
// assigneeId: qberserkerq@gmail.com