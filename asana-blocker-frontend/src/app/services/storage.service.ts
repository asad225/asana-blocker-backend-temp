import { DatePipe } from '@angular/common';
import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HistoryInterface } from '../history/history.component';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private _apiToken: string = '';
  private _taskId!: number;
  private _assigneeId!: number;
  private _assigneeEmail!: string;
  
  credentialsSaved$ = new Subject<boolean>();

  saveData(key: string, data: any): void {
    localStorage.setItem(key, JSON.stringify(data));
  }

  getData(key: string): any {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : null;
  }

  removeData(key: string): void {
    localStorage.removeItem(key);
  }

  
  get apiToken(): string {
    return this._apiToken;
  }

  set apiToken(token: string) {
    this._apiToken = token;
  }

  get taskId(): number {
    return this._taskId;
  }

  set taskId(taskId: number) {
    this._taskId = taskId;
  }

  get assigneeId(): number {
    return this._assigneeId;
  }

  set assigneeId(assigneeId: number) {
    this._assigneeId = assigneeId;
  }

  get assigneeEmail(): string {
    return this._assigneeEmail;
  }

  set assigneeEmail(assigneeEmail: string) {
    this._assigneeEmail = assigneeEmail;
  }

  

  async get(prop: string): Promise<any> {
    return new Promise((resolve, reject) => {
      chrome.storage.local.get(prop, (result) => {
        if (result[prop] === undefined) {
          resolve(undefined);
        } else {
          if (prop === 'apiToken') this.apiToken = result[prop];
          if (prop === 'taskId') this.taskId = result[prop];
          if (prop === 'assigneeId') this.assigneeId = result[prop];
          resolve(result[prop]);
        }
      });
    });
  }

  async set(obj: any): Promise<undefined> {
    console.log(`Storage service object: `, obj);
    
    return new Promise((resolve, reject) => {
      chrome.storage.local.set(obj, () => {
        resolve(undefined)
      });
    });
  }

  async remove(name: string): Promise<undefined> {
    return new Promise((resolve, reject) => {
      chrome.storage.local.remove(name, () => {
        resolve(undefined)
      });
    });
  }

  async pushToHistory(item: HistoryInterface, date: Date | string = new Date()): Promise<void> {
    if (item) {
      const history = await this.get('history');
      if (history.length > 500) {
        history.pop();
      }
      
      history.unshift({
        ...item,
        date: new DatePipe("en-US").transform(date, 'MM/dd/yyyy h:mm')
      });
      
      this.set({
        history
      });
    }
  }
}
