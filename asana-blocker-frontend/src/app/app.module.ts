import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { MatStepperModule } from '@angular/material/stepper';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { TextFieldModule } from '@angular/cdk/text-field';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatDividerModule} from '@angular/material/divider';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatDialogModule} from '@angular/material/dialog';
import {MatTooltipModule} from '@angular/material/tooltip';
import { MatToolbarModule } from '@angular/material/toolbar';
import {MatTabsModule} from '@angular/material/tabs';

import { MatGridListModule } from '@angular/material/grid-list';
import { MatListModule } from '@angular/material/list';
import {MatMenuModule} from '@angular/material/menu';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatRadioModule} from '@angular/material/radio';
import {MatSelectModule} from '@angular/material/select';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GoalsCredentialsStepperComponent } from './goals-credentials-stepper/goals-credentials-stepper.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ContinueBtnComponent } from './continue-btn/continue-btn.component';
import { BlockingComponent } from './blocking/blocking.component';
import { DialogOverviewExampleDialog, HistoryComponent } from './history/history.component';
import { UnblockStringsComponent } from './blocking/unblock-strings/unblock-strings.component';
import { HttpClientModule } from '@angular/common/http';
import { ConfirmmodalComponent } from './compnents/confirmmodal/confirmmodal.component';
import { GoalsAutomaticComponent } from './goals-automatic/goals-automatic.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { ProfileComponent } from './profile/profile.component';
import { EditprofileComponent } from './profile/editprofile/editprofile.component';
import { SitesApiService } from './services/sites-api.service';
@NgModule({
  declarations: [
    AppComponent,
    GoalsCredentialsStepperComponent,
    ContinueBtnComponent,
    BlockingComponent,
    HistoryComponent,
    DialogOverviewExampleDialog,
    UnblockStringsComponent,
    ConfirmmodalComponent,
    GoalsAutomaticComponent,
    LoginComponent,
    SignupComponent,
    ProfileComponent,
    EditprofileComponent,
  ],
  imports: [
  BrowserModule,
    AppRoutingModule,
    MatStepperModule,
    MatTableModule,
    MatDividerModule,
    MatFormFieldModule,
    MatToolbarModule,
    MatTooltipModule,
    MatListModule,
    MatSnackBarModule,
    MatInputModule,
    MatButtonModule,
    MatTabsModule,
    MatDialogModule,
    MatSelectModule,
    MatRadioModule,
    MatGridListModule,
    TextFieldModule,
    MatSidenavModule,
    MatCheckboxModule,
    MatIconModule,
    MatExpansionModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    MatMenuModule
  ],
  providers: [SitesApiService,LoginComponent],
  bootstrap: [AppComponent]
})
export class AppModule { }
