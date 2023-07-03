import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BlockingComponent } from './blocking/blocking.component';
import { GoalsCredentialsStepperComponent } from './goals-credentials-stepper/goals-credentials-stepper.component';
import { HistoryComponent } from './history/history.component';
import { BlockingsResolverService } from './services/blocking-resolver.service';
import { GoalsAutomaticComponent } from './goals-automatic/goals-automatic.component';
import { AutomaticResolverService } from './services/automatic-resolver.service';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { EditprofileComponent } from './profile/editprofile/editprofile.component';
import { ProfileComponent } from './profile/profile.component';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  }, {
    path: 'blocking',
    component: BlockingComponent,
    resolve: { data: BlockingsResolverService }
  }, {
    path: 'goals-manual',
    component: GoalsCredentialsStepperComponent
  }, {
    path: 'goals-automatic',
    component: GoalsAutomaticComponent,
    resolve: { data: AutomaticResolverService }
  }, {
    path: 'history',
    component: HistoryComponent
  },
  {
    path: 'signup',
    component: SignupComponent
  },
  {
    path: 'profile',
    component: ProfileComponent
  },
  {
    path: 'editprofile',
    component: EditprofileComponent
  },
  {
    path: 'settings',
    loadChildren: () => import('./settings/settings.module').then(m => m.SettingsModule),
  },
  
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],

exports: [RouterModule]
})
export class AppRoutingModule { }
