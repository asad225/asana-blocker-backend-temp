import { Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { StorageService } from './storage.service';
 
@Injectable({
  providedIn: 'root'
})
export class BlockingsResolverService implements Resolve<any> {
  constructor(
    private _stor: StorageService,
) {}
  async resolve(): Promise<any> {
    return await this._stor.get('blockedWebsites');
  }
}