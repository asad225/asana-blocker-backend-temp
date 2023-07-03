import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'ab-confirmmodal',
  templateUrl: './confirmmodal.component.html',
  styleUrls: ['./confirmmodal.component.scss']
})
export class ConfirmmodalComponent {
  constructor(
    public dialogRef: MatDialogRef<ConfirmmodalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }
}
