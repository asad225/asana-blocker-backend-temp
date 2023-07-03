import { Component, OnInit, Inject } from '@angular/core';
import {MatDialog, MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { StorageService } from '../services/storage.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ConfirmmodalComponent } from '../compnents/confirmmodal/confirmmodal.component';
import { TitleService } from '../services/title.service';

export interface HistoryInterface {
  action: 'Api token change' |
          'Task id change' |
          'Assignee email change' |
          'Website add' |
          'Website remove' |
          'Automatic(good) Website add' |
          'Automatic(good) Website remove' |
          'Blocking start' |
          'Blocking stop' |
          'Task tick' |
          'Unblock interval start' |
          'Unblock interval finish';
  description: any;
  date?: Date | string;
}

@Component({
  selector: 'ab-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.scss']
})
export class HistoryComponent implements OnInit {
  noRecords = true;
  displayedColumns: string[] = ['action', 'description', 'date'];
  dataSource!: MatTableDataSource<HistoryInterface>;

  constructor(
    private _stor: StorageService,
    public dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private _titleService: TitleService
  ) {}

  ngOnInit(): void {
    this._titleService.title$.next('History');
    this.initData();
  }

  async initData(): Promise<void> {
    const data = await this._stor.get('history');
    
    if (data.length) {
      this.noRecords = false;
      this.dataSource = new MatTableDataSource(data);
    }
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action);
  }

  cleanHistory(): void {
    const dialogRef: MatDialogRef<any> = this.dialog.open(ConfirmmodalComponent, {
      width: '400px',
      data: { message: 'Are you sure you want to clear the history?' }
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this._stor.remove('history');
        this._stor.set({
          'history': []
        });
        this.dataSource = new MatTableDataSource([] as any);
        this.noRecords = true;
        this.openSnackBar('History has been cleaned', 'close');
      }
    });
  }

  openModal(arr: any): void {
    const dialogRef = this.dialog.open(DialogOverviewExampleDialog, {
      data: {
        arr
      },
      minWidth: '250px',
      width: '70vw',
    });
    

    dialogRef.afterClosed().subscribe();
  }
}

@Component({
  selector: 'dialog-overview-example-dialog',
  templateUrl: './popup.template.html',
})
export class DialogOverviewExampleDialog {
  constructor(
    public dialogRef: MatDialogRef<DialogOverviewExampleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}