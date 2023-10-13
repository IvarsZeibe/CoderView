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
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { ClipboardModule } from '@angular/cdk/clipboard';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { SignInComponent } from './signin/signin.component';
import { SignUpComponent } from './signup/signup.component';
import { httpInterceptorProviders } from './_helpers/http.interceptor';
import { PostsComponent } from './posts/posts.component';
import { NewPostComponent } from './new-post/new-post.component';
import { PostComponent } from './post/post.component';
import { HomeComponent } from './home/home.component';
import { ProfileComponent } from './profile/profile.component';
import { CommentSectionComponent } from './comment-section/comment-section.component';
import { ClickStopPropagationDirective } from './_helpers/click-stop-propagation.directive';
import { DeleteDialogComponent } from './delete-dialog/delete-dialog.component';

@NgModule({
	declarations: [
		AppComponent, NavMenuComponent, SignInComponent,
		SignUpComponent, PostsComponent, NewPostComponent,
		PostComponent, HomeComponent, ProfileComponent,
		CommentSectionComponent, ClickStopPropagationDirective, DeleteDialogComponent
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
		MatProgressBarModule, MatDialogModule,
		MatChipsModule, MatAutocompleteModule,
		MatSelectModule, ClipboardModule,
		MatSnackBarModule
	],
	providers: [httpInterceptorProviders],
	bootstrap: [AppComponent],
})
export class AppModule {}
