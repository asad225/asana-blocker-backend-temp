import { Component, HostListener, Inject, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Randoms } from 'src/app/helpers/randoms';
import { Strings } from 'src/app/helpers/strings';

@Component({
  selector: 'ab-unblock-strings',
  templateUrl: './unblock-strings.component.html',
  styleUrls: ['./unblock-strings.component.scss']
})
export class UnblockStringsComponent implements OnInit {
  inputString = new FormControl('', Validators.required);
  randomString: string = '';
  notTheSame = false;

  constructor(
    public dialogRef: MatDialogRef<UnblockStringsComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {}

  @HostListener('paste', ['$event']) blockPaste(e: KeyboardEvent) {
    e.preventDefault();
  }

  @HostListener('copy', ['$event']) blockCopy(e: KeyboardEvent) {
    e.preventDefault();
  }

  @HostListener('cut', ['$event']) blockCut(e: KeyboardEvent) {
    e.preventDefault();
  }
  
  ngOnInit(): void {
    this.randomString = Randoms.getRandomString(this.data.len);
  }

  save(): void {
    if (!this.inputString.value) {
      this.inputString.markAsTouched();
      return;
    }
    
    if (!Strings.compareStringsCaseSensitive(this.randomString, this.inputString.value)) {
      this.inputString.setErrors({'notMatching': true});
      this.notTheSame = true;
      return;
    }

    this.dialogRef.close(true);
  }
}
