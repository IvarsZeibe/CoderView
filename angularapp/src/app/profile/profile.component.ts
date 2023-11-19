import { Component, OnInit, ViewChild } from '@angular/core';
import { MyComment, MyPost, UserService } from '../_services/user.service';
import { FormControl, Validators } from '@angular/forms';
import { PasswordConfirmationValidatorService } from '../_services/password-confirmation-validator.service';
import { DateHelperService } from '../_services/date-helper.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';
import { Router } from '@angular/router';
import { AuthService } from '../_services/auth-service.service';
import { StorageService } from '../_services/storage.service';

@Component({
	selector: 'app-profile',
	templateUrl: './profile.component.html',
	styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
	username = "";
	usernameFormControl = new FormControl("", { nonNullable: true, validators: [Validators.required] });
	isChangingUsername = false;
	usernameError = "";

	email = "";
	emailFormControl = new FormControl("", { nonNullable: true, validators: [Validators.required, Validators.email] });
	isChangingEmail = false;
	emailError = "";

	oldPasswordFormControl = new FormControl("", { nonNullable: true, validators: [Validators.required] });
	newPasswordFormControl = new FormControl("", { nonNullable: true, validators: [Validators.required] });
	confirmNewPasswordFormControl = new FormControl("", { nonNullable: true, validators: [Validators.required] });
	isChangingPassword = false;
	passwordError = "";

	currentTime = new Date();

	comments: MyComment[] = [];
	commentDataSource = new MatTableDataSource(this.comments);
	displayedCommentHistoryColumns: string[] = ['postTitle', 'commentContent', 'voteCount', 'createdOn'];
	@ViewChild("commentPaginator") commentPaginator: MatPaginator | null = null;


	posts: MyPost[] = [];
	postDataSource = new MatTableDataSource(this.posts);
	displayedPostHistoryColumns: string[] = ['title', 'commentCount', 'voteCount', 'createdOn'];
	@ViewChild("postPaginator") postPaginator: MatPaginator | null = null;


	constructor(
		private userService: UserService,
		private passwordConfirmationValidator: PasswordConfirmationValidatorService,
		public dateHelperService: DateHelperService,
		private dialog: MatDialog,
		private router: Router,
		private authService: AuthService,
		private storageService: StorageService
	) { }

	ngOnInit(): void {
		this.userService.getUserData().subscribe({
			next: data => {
				this.username = data.username;
				this.email = data.email;
			}
		});

		this.userService.getCommentHistory().subscribe({
			next: comments => {
				this.commentDataSource = new MatTableDataSource(comments);
				this.commentDataSource.paginator = this.commentPaginator;
			}
		});

		this.userService.getPostHistory().subscribe({
			next: posts => {
				this.postDataSource = new MatTableDataSource(posts);
				this.postDataSource.paginator = this.postPaginator;
			}
		});

		this.newPasswordFormControl.setValidators([
			this.passwordConfirmationValidator.validatePassword(this.confirmNewPasswordFormControl)]);

		this.confirmNewPasswordFormControl.setValidators([Validators.required,
			this.passwordConfirmationValidator.validateConfirmPassword(this.newPasswordFormControl)]);
	}

	startUsernameChange() {
		this.isChangingUsername = true;
		this.usernameFormControl.setValue(this.username);
	}

	cancelUsernameChange() {
		this.isChangingUsername = false;
	}

	saveUsernameChanges() {
		const trimmedUsername = this.usernameFormControl.value.trim();
		this.usernameFormControl.setValue(trimmedUsername);
		this.userService.changeUsername(trimmedUsername).subscribe(data => {
			if (data.succeeded) {
				this.username = trimmedUsername;
				this.isChangingUsername = false;
			} else {
				const errors: any[] = Object.values(data.errors);
				if (errors.length > 0) {
					this.usernameError = errors[0].description;
				} else {
					this.usernameError = "Username invalid";
				}
				this.usernameFormControl.setErrors({});
			}
		});
	}

	startEmailChange() {
		this.isChangingEmail = true;
		this.emailFormControl.setValue(this.email);
	}

	cancelEmailChange() {
		this.isChangingEmail = false;
	}

	saveEmailChanges() {
		const trimmedEmail = this.emailFormControl.value;
		this.emailFormControl.setValue(trimmedEmail);
		this.userService.changeEmail(trimmedEmail).subscribe(data => {
			if (data.succeeded) {
				this.isChangingEmail = false;
				this.email = trimmedEmail;
			} else {
				const errors: any[] = Object.values(data.errors);
				if (errors.length > 0) {
					this.emailError = errors[0].description;
				} else {
					this.emailError = "Email invalid";
				}
				this.emailFormControl.setErrors({});
			}
		});
	}

	startPasswordChange() {
		this.isChangingPassword = true;
		this.oldPasswordFormControl.setValue("");
		this.newPasswordFormControl.setValue("");
		this.confirmNewPasswordFormControl.setValue("");
	}

	cancelPasswordChange() {
		this.isChangingPassword = false;
	}

	savePasswordChanges() {
		this.userService.changePassword(this.oldPasswordFormControl.value, this.newPasswordFormControl.value).subscribe(data => {
			if (data.succeeded) {
				this.isChangingPassword = false;
			} else {
				const errors: any[] = Object.values(data.errors);
				if (errors.length > 0) {
					let incorrectPassword = false;
					for (const error of errors) {
						if (error.code == "PasswordMismatch") {
							this.oldPasswordFormControl.setErrors({});
							incorrectPassword = true;
							break;
						}
					}
					if (!incorrectPassword) {
						this.passwordError = errors[0].description;
						this.newPasswordFormControl.setErrors({});
					}
				} else {
					this.passwordError = "Password invalid";
				}
			}
		});
	}

	openDeleteAccountDialog() {
		this.dialog.open(DeleteDialogComponent, {
			data: {
				title: "Delete account",
				content: "Are you sure you want to delete your account?\n This action is irreversible.",
				deleteAction: () => {
					this.userService.deleteAccount().subscribe({
						next: () => {
							this.storageService.clean();
							this.authService.forceRunAuthGuard();
							this.router.navigate(['/']);
						},
						error: (e) => {
							console.log(e);
						}
					});
				}
			}
		});
	}
}
