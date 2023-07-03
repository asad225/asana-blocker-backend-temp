import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { StorageService } from 'src/app/services/storage.service';

@Component({
  selector: 'ab-editprofile',
  templateUrl: './editprofile.component.html',
  styleUrls: ['./editprofile.component.scss']
})
export class EditprofileComponent {

  constructor(private authService: AuthService, private router: Router, private storageService: StorageService) { }

  data: any = [];
  userData: any[] = [];
  location: string = '';
  phoneNumber: string = '';
  password: string = '';
  userId: any;
  ngOnInit(): void {

    this.data = this.storageService.getData('myKey');
    this.userId = [this.data.user._id];
  }
  saveChanges() {
    let data = {
      location: this.location,
      phoneNumber: this.phoneNumber,
      password: this.password,
      userId: this.userId
    };
    console.log("data : ", data)
    this.authService.updateUser(data).subscribe((data: any) => {
      this.router.navigate(['/profile']);
      console.log("res data : ", data)
    })
  }
  selectedFileName: string = '';

  onFileSelected(event: any) {
    const file = event.target.files[0];
    this.selectedFileName = file ? file.name : '';
    // Perform any additional operations with the selected file if needed
  }
}
