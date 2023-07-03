import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ReplaySubject, takeUntil } from 'rxjs';
import { StorageService } from './services/storage.service';
import { TitleService } from './services/title.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  private destroyed$: ReplaySubject<boolean> = new ReplaySubject(1);
  title = 'Blockings';
  showGoalsSubMenu = false;

  constructor(
    private _stor: StorageService,
    private _router: Router,
    private _titleService: TitleService
  ) {}

  async ngOnInit(): Promise<void> {
    if (!await this._stor.get('rewardMethod')) {
      this._stor.set({
        rewardMethod: 'automatic'
      });
    }

    if (!await this._stor.get('history')) {
      this._stor.set({
        history: []
      });
    }
    
    this.handleTitleChange();
  }

  handleTitleChange(): void {
    this._titleService.title$.subscribe((title: string) => {
      this.title = title;
    });
  }

  ngOnDestroy() {
    this.destroyed$.next(true);
    this.destroyed$.complete();
  }
}
