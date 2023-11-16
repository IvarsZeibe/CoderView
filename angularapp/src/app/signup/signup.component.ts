import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth-service.service';
import { PasswordConfirmationValidatorService } from '../_services/password-confirmation-validator.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize, of, switchMap } from 'rxjs';
import { StorageService } from '../_services/storage.service';

@Component({
	selector: 'app-signup',
	templateUrl: './signup.component.html',
	styleUrls: ['./signup.component.css'],
})
export class SignUpComponent implements OnInit {
	registerForm!: FormGroup;

	errorMessage = '';
	isSignupFailed = false;
	isLoading = false;

	constructor(
		private authService: AuthService,
		private storageService: StorageService,
		private passwordConfirmationValidator: PasswordConfirmationValidatorService,
		private router: Router,
		private route: ActivatedRoute
	) { }

	ngOnInit(): void {
		this.registerForm = new FormGroup({
			username: new FormControl('', [Validators.required]),
			email: new FormControl('', [Validators.required, Validators.email]),
			password: new FormControl('', [Validators.required]),
			confirmPassword: new FormControl('')
		});

		this.registerForm.get('password')!.setValidators([Validators.required,
			this.passwordConfirmationValidator.validatePassword(this.registerForm.get('confirmPassword')!)]);
		this.registerForm.get('confirmPassword')!.setValidators([Validators.required,
			this.passwordConfirmationValidator.validateConfirmPassword(this.registerForm.get('password')!)]);
	}

	onSubmit(): void {
		this.isSignupFailed = false;
		this.isLoading = true;
		const { username, email, password } = this.registerForm.value;

		this.authService.register(username, email, password)
			.pipe(
				finalize(() => {
					this.isLoading = false;
				})
			)
			.subscribe({
			next: data => {
				if (data.succeeded) {
					let roles: string[];
					let isLoginSuccessful: boolean;
					this.authService.login(username, password)
						.pipe(
							switchMap(isSuccess => {
								isLoginSuccessful = isSuccess;
								return isSuccess ? this.authService.getRoles() : of([]);
							}),
							finalize(() => {
								if (isLoginSuccessful) {
									this.storageService.saveUser(username, roles);
									const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
									this.router.navigateByUrl(returnUrl);
								}
							})
						).subscribe(r => roles = r);
				} else {
					this.errorMessage = '';
					const errors = Object.values(data.errors);
					errors.map((m: any) => {
						this.errorMessage += m.description + '<br>';
					});
					this.errorMessage.slice(0, -4);
					this.isSignupFailed = true;
				}
			},
			error: err => {
				this.errorMessage = err.error.message;
			},
		});

	}

	public validateControl = (controlName: string) => {
		const form = this.registerForm.get(controlName)!;
		return form.invalid && form.touched;
	}

	public hasError = (controlName: string, errorName: string) => {
		return this.registerForm.get(controlName)!.hasError(errorName)
	}
}
