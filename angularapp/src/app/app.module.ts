import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';
import { MatProgressBarModule } from '@angular/material/progress-bar';

import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { SignInComponent } from './signin/signin.component';
import { SignUpComponent } from './signup/signup.component';
import { httpInterceptorProviders } from './_helpers/http.interceptor';
import { PostsComponent } from './posts/posts.component';
import { NewPostComponent } from './new-post/new-post.component';
import { PostComponent } from './post/post.component';
import { HomeComponent } from './home/home.component';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
	declarations: [
		AppComponent, NavMenuComponent, SignInComponent,
		SignUpComponent, PostsComponent, NewPostComponent,
		PostComponent, HomeComponent
	],
	imports: [
		BrowserModule,
		BrowserAnimationsModule,
		HttpClientModule,
		AppRoutingModule,
		MatToolbarModule,
		MatButtonModule,
		MatInputModule,
		MatFormFieldModule,
		FormsModule, ReactiveFormsModule,
		MatCardModule, MatIconModule,
		MatProgressBarModule, MatDialogModule
	],
	providers: [httpInterceptorProviders],
	bootstrap: [AppComponent],
})
export class AppModule {}
