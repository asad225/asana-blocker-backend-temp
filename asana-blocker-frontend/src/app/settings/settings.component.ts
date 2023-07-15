import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { StorageService } from '../services/storage.service';
import { Randoms } from '../helpers/randoms';
import { debounce, timer } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TitleService } from '../services/title.service';
import { SettingService } from '../services/setting.service';
import { SitesApiService } from '../services/sites-api.service';

@Component({
  selector: 'ab-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class SettingsComponent implements OnInit {
  randomTextOnOff = new FormControl(false);
  randomTextStringLength = new FormControl(10, [Validators.required]);
  asanaTaskCheck = new FormControl(0.02, [
    Validators.required,
    Validators.min(0.000000001)
  ]);
  goalDifficulty = new FormControl('medium');
  difficultyLevels = [
    {id: 'easy', name: 'Easy'},
    {id: 'medium', name: 'Medium'},
    {id: 'hard', name: 'Hard'}

  ];
  data: any = [];
  randomTextOfLength: string = '';
  rewardMethod = new FormControl('automatic');
  rewardMethods = [
    {id: 'automatic', name: 'Automatic'},
    {id: 'manual', name: 'Manual'}
  ];

  constructor(
    private storageService: StorageService,
    private settingService: SettingService,
    private _stor: StorageService,
    private _snackBar: MatSnackBar,
    private _cdr: ChangeDetectorRef,
    private _titleService: TitleService,
    private _siteApiServices:SitesApiService
  ) {}

  ngOnInit(): void {
    // this.data = this.storageService.getData('userData');
    this._titleService.title$.next('Settings');
    this.initRandomText();
    this.initRandomTextWatchers();
    this.initAsanaTaskCheck();
    this.initRewardMethod();
    this._cdr.detectChanges();
    chrome.storage.local.get('goal')
  .then(result => {
    if (result['goal'] && result['goal'][0]._id !== " ") {
      this.goalDifficulty.setValue(result['goal'][0].difficulty)
    }
  })
  }
  
  async initRewardMethod(): Promise<void> {
    // this.settingService.getMDataByUserId(this.data._id).subscribe((res:any) => {
    //   console.log("res : data :",res)
    // })
    const val = await this._stor.get('rewardMethod');
    val && this.rewardMethod.setValue(val);
  }

  saveRewardMethodChange(): void {
    if (this.rewardMethod.value) {
      this._stor.set({
        'rewardMethod': this.rewardMethod.value
      });
      this.openSnackBar('Saved!', 'close');
    }
  }

  initRandomTextWatchers(): void {
    this.randomTextStringLength.valueChanges.pipe(
      debounce(() => timer(400))
    ).subscribe(() => {
      this.generateRandomText();
    });
  }

  async initAsanaTaskCheck(): Promise<void> {
    // this.settingService.getCheckIntervalDataByUserId(this.data._id).subscribe((res:any) => {
    //   console.log("res : data :",res)
    // })
    const val = await this._stor.get('asanaTaskCheckIntervalBg');
    val && this.asanaTaskCheck.setValue(val);
  }

  async initRandomText(): Promise<void> {
    // this.settingService.getTDataByUserId(this.data._id).subscribe((res:any) => {
    //   console.log("res 321 : data :",res)
    // })
    let result = await this._stor.get('randomText');
    if (result && result.onoff !== undefined) {
      this.randomTextOnOff.setValue(result.onoff);
      if (result.onoff) {
        this.randomTextStringLength.setValidators([Validators.required]);
      }
    }
    if (result && result.len !== undefined) {
      this.randomTextStringLength.setValue(result.len);
    }
    this.generateRandomText();
  }

  saveRandomText(): void {
    let onoff = this.randomTextOnOff.value;
    let len = this.randomTextStringLength.value;

    if (this.randomTextStringLength.valid || !onoff) {
      this._stor.set({
        randomText: {
          onoff:onoff,
          len: onoff ? len : undefined
        }
      });
      this.openSnackBar('Saved!', 'close');
    } else {
      this.randomTextStringLength.markAsTouched();
    }
    this._cdr.detectChanges();
  }

  saveAsanaTaskInterval(): void {
    const val = this.asanaTaskCheck.value;
    if (this.asanaTaskCheck.invalid) {
      this.asanaTaskCheck.markAsTouched();
    } else {
      this._stor.set({
        asanaTaskCheckInterval: val
      });
      this._stor.set({
        asanaTaskCheckIntervalBg: val
      });
      this.openSnackBar('Saved!', 'close');
    }
    this._cdr.detectChanges();
  }

  saveGoalDifficulty(){
    chrome.storage.local.get('goal')
  .then(result => {
    if (result['goal'] && result['goal'][0]._id !== " ") {
      this._siteApiServices.updateGoal(result['goal'][0]._id,{difficulty:this.goalDifficulty.value}).subscribe((res:any)=>{
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
            
            
          })
        }
      });  
    }
  })
  .catch(error => {
    console.error(error);
  });
  }
  

  generateRandomText(): void {
    this.randomTextOfLength = this.randomTextStringLength.value ? Randoms.getRandomString(this.randomTextStringLength.value) : ''
    this._cdr.detectChanges();
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }
}
