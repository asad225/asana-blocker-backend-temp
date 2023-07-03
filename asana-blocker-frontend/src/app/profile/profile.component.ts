import { Component } from '@angular/core';
import { MatGridListModule } from '@angular/material/grid-list';
import { AuthService } from '../services/auth.service';
import { StorageService } from '../services/storage.service';

@Component({
  selector: 'ab-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent {

  data: any = [];
  userData: any[] = [];

  constructor(private storageService: StorageService, private authService: AuthService) { }

  ngOnInit(): void {
    this.data = this.storageService.getData('userData');
    this.authService.getUserById(this.data._id).subscribe((data: any) => {
      this.userData = data
      console.log("data from local storage:", data);
    })
  }

}
