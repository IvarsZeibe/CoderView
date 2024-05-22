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
import { MatExpansionModule } from '@angular/material/expansion';
import { MatMenuModule } from '@angular/material/menu';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { CanvasJSAngularChartsModule } from '@canvasjs/angular-charts';
import { MatButtonToggleModule } from '@angular/material/button-toggle';


import { AppComponent } from './app.component';
import { NavMenuComponent } from './nav-menu/nav-menu.component';
import { SignInComponent } from './signin/signin.component';
import { SignUpComponent } from './signup/signup.component';
import { httpInterceptorProviders } from './_helpers/http.interceptor';
import { PostsComponent } from './posts/posts.component';
import { NewPostComponent } from './new-post/new-post.component';
import { PostComponent } from './post/post.component';
import { ProfileComponent } from './profile/profile.component';
import { CommentSectionComponent } from './comment-section/comment-section.component';
import { ClickStopPropagationDirective } from './_helpers/click-stop-propagation.directive';
import { DeleteDialogComponent } from './delete-dialog/delete-dialog.component';
import { ControlPanelComponent } from './control-panel/control-panel.component';
import { ManageUserDialogComponent } from './manage-user-dialog/manage-user-dialog.component';
import { ConfirmResetPasswordDialogComponent } from './confirm-reset-password-dialog/confirm-reset-password-dialog.component';

@NgModule({
	declarations: [
		AppComponent, NavMenuComponent, SignInComponent,
		SignUpComponent, PostsComponent, NewPostComponent,
		PostComponent, ProfileComponent,
		CommentSectionComponent, ClickStopPropagationDirective, DeleteDialogComponent, ControlPanelComponent, ManageUserDialogComponent, ConfirmResetPasswordDialogComponent
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
		MatSnackBarModule, MatExpansionModule,
		MatMenuModule, MonacoEditorModule.forRoot(),
		DragDropModule, MatTableModule,
		MatPaginatorModule, CanvasJSAngularChartsModule,
		MatButtonToggleModule, MatSortModule
	],
	providers: [httpInterceptorProviders],
	bootstrap: [AppComponent],
})
export class AppModule {}
