import { Component } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { StorageService } from 'src/app/services/storage.service';


@Component({
  selector: 'ab-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  formData: any = {};


  constructor(private dialog: MatDialog,private authService: AuthService, private router: Router, private storageService:StorageService) {}

  
  submitForm() {
    this.authService.userLogin(this.formData).subscribe((data: any) => {
      this.router.navigate(['/profile']);
      this.storageService.saveData('userData', data.user);
      this.storageService.saveData('authToken', data.token);
    })
  }


}
