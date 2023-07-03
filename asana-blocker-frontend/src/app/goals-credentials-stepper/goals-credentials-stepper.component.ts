import {CdkTextareaAutosize} from '@angular/cdk/text-field';
import {ChangeDetectionStrategy, ChangeDetectorRef, Component, NgZone, OnInit, ViewChild} from '@angular/core';
import {take} from 'rxjs/operators';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { StorageService } from '../services/storage.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { AsanaService } from '../services/asana.service';
import { TitleService } from '../services/title.service';

@Component({
  selector: 'ab-goals-credentials-stepper',
  templateUrl: './goals-credentials-stepper.component.html',
  styleUrls: ['./goals-credentials-stepper.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class GoalsCredentialsStepperComponent implements OnInit {
  @ViewChild('autosize') autosize!: CdkTextareaAutosize;
  
  firstFormGroup = this._formBuilder.group({
    apiToken: ['', Validators.compose([
      Validators.required,
      Validators.pattern(/^1\/\d{16}:[a-f0-9]{32}$/)
    ])],
    toStorage: [''],
  });
  secondFormGroup = this._formBuilder.group({
    taskId: ['', Validators.compose([
      Validators.required,
      Validators.pattern(/^1\d{15}$/)
    ])],
    toStorage: [''],
  });
  thirdFormGroup = this._formBuilder.group({
    assigneeEmail: ['', Validators.compose([
      Validators.required,
      Validators.pattern(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
    ])],
    toStorage: [''],
  });
  
  constructor(
    private _formBuilder: FormBuilder,
    private _ngZone: NgZone,
    private _stor: StorageService,
    private _cdr: ChangeDetectorRef,
    private _snackBar: MatSnackBar,
    private _router: Router,
    private _asanaApi: AsanaService,
    private _titleService: TitleService
  ) {}

  async ngOnInit(): Promise<void> {
    const apiToken = await this._stor.get('apiToken');
    const taskId = await this._stor.get('taskId');
    const assigneeEmail = await this._stor.get('assigneeEmail');
    const apiTokenSaved = await this._stor.get('apiTokenSaved');
    const taskIdSaved = await this._stor.get('taskIdSaved');
    const assigneeEmailSaved = await this._stor.get('assigneeEmailSaved');
    
    this.firstFormGroup.patchValue({
      apiToken,
      toStorage: apiTokenSaved
    });
    this.secondFormGroup.patchValue({
      taskId,
      toStorage: taskIdSaved
    });
    this.thirdFormGroup.patchValue({
      assigneeEmail,
      toStorage: assigneeEmailSaved
    });
    if (assigneeEmail) {
      this.getAndSaveAssigneeId(assigneeEmail);
    }
    this._titleService.title$.next('Goals > Manual');
    this._cdr.detectChanges();
  }

  triggerResize() {
    this._ngZone.onStable.pipe(take(1)).subscribe(() => {
      this.autosize.resizeToFitContent(true);
      this._cdr.detectChanges();
    });
  }

  async saveData(type: string, form: FormGroup): Promise<void> {
    if (form.value[type]) {
      let msg = '';
      let historyAction: 'Api token change' | 'Task id change' | 'Assignee email change' = 'Api token change';
      let historyValue;
      if (type === 'apiToken') {
        this._stor.apiToken = form.value.apiToken;
        historyAction = 'Api token change';
        historyValue = form.value.apiToken;
        msg = 'Api token';
      }
      if (type === 'taskId') {
        this._stor.taskId = form.value.taskId;
        historyAction = 'Task id change';
        historyValue = form.value.taskId;
        msg = 'Task id';
      }
      if (type === 'assigneeEmail') {
        this._stor.assigneeEmail = form.value.assigneeEmail;
        historyAction = 'Assignee email change';
        historyValue = form.value.assigneeEmail;
        msg = 'Assignee email';
        this.getAndSaveAssigneeId(form.value.assigneeEmail);
      }

      this._stor.pushToHistory({
        action: historyAction,
        description: historyValue
      });

      if (form.value.toStorage) {
        this._stor.set({
          [type]: form.value[type]
        });
        this._stor.set({
          [`${type}Saved`]: true
        });
      }

      this.openSnackBar(`${msg} is saved successfully`, `close`);

      if (this._stor.apiToken && this._stor.taskId) {
        this._stor.credentialsSaved$.next(true);
      } else {
        this._stor.credentialsSaved$.next(false);
      }
    }
    this._cdr.detectChanges();
  }

  getAndSaveAssigneeId(email: string): void {
    this._asanaApi.getAsanaAssignee(email).subscribe({
      next: (response) => {
        this._stor.set({
          'assigneeId': response.data.gid
        });
        this._stor.set({
          'assigneeIdBg': response.data.gid
        });
        this.thirdFormGroup.get('assigneeEmail')?.setErrors({'ivalidEmail': false});
        this.thirdFormGroup.get('assigneeEmail')?.updateValueAndValidity();
        this._cdr.detectChanges();
      },
      error: (e) => {
        this.thirdFormGroup.get('assigneeEmail')?.setErrors({'ivalidEmail': true});
        this._stor.remove('assigneeId');
        this._stor.remove('assigneeIdBg');
        this.thirdFormGroup.get('assigneeEmail')?.markAsTouched();
        this._cdr.detectChanges();
      },
    });
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }

  save() {
    this._router.navigate(['/blocking']);
  }
  goTo(addr: string): void {
    this._router.navigate([addr]);
    window.open(addr, '_blank');
  }
}
