import { Component } from '@angular/core';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import {FormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material/button';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConfirmmodalComponent } from 'src/app/compnents/confirmmodal/confirmmodal.component';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'ab-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
  imports!: [FormsModule, MatFormFieldModule, MatInputModule,MatButtonModule];
  
  formData: any = {};

 
  constructor(private dialog: MatDialog,private authService: AuthService, private router: Router) {}

  submitForm() {
    if (this.formData.password !== this.formData.confirmPassword) {
      this.openModal();
    } else {
let data ={
  "firstName":this.formData.firstName,
  "lastName":this.formData.lastName,
  "email":this.formData.email,
  "password":this.formData.password,
}
this.authService.userSignUp(data).subscribe((data: any) => {
this.router.navigate(['/login']);
})
    }
  }

  openModal() {
    const dialogRef: MatDialogRef<any> = this.dialog.open(ConfirmmodalComponent, {
      width: '400px',
      data: { message: 'Password and Confirm Password do not match.' }
    });
  }
}
