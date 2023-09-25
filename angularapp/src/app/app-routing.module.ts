import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { HomeComponent } from './home/home.component';
import { SignInComponent } from './signin/signin.component';
import { SignUpComponent } from './signup/signup.component';
import { AccessGuard } from './_helpers/access.guard';
import { ProfileComponent } from './profile/profile.component';
import { PostsComponent } from './posts/posts.component';
import { PostComponent } from './post/post.component';
import { NewPostComponent } from './new-post/new-post.component';

const routes: Routes = [
	{ path: '', component: HomeComponent, pathMatch: 'full' },
	{ path: 'about', component: AboutComponent },
	{ path: 'posts', component: PostsComponent },
	{ path: 'post/:id', component: PostComponent },
	{
		path: 'new_post',
		component: NewPostComponent,
		data: { requiresLogin: true },
		canActivate: [AccessGuard]
	},
	{
		path: 'profile',
		component: ProfileComponent,
		data: { requiresLogin: true },
		canActivate: [AccessGuard]
	},
	{
		path: 'signin',
		component: SignInComponent,
		data: { guestOnly: true },
		canActivate: [AccessGuard]
	},
	{ path: 'signup', component: SignUpComponent },
];

@NgModule({
	imports: [RouterModule.forRoot(routes)],
	exports: [RouterModule],
})
export class AppRoutingModule {}
