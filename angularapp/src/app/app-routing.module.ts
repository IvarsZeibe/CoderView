import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { HomeComponent } from './home/home.component';
import { SignInComponent } from './signin/signin.component';
import { SignUpComponent } from './signup/signup.component';

const routes: Routes = [
	{ path: '', component: HomeComponent, pathMatch: 'full' },
	{ path: 'about', component: AboutComponent },
	{ path: 'signin', component: SignInComponent },
	{ path: 'signup', component: SignUpComponent },
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
})
export class AppRoutingModule {}
