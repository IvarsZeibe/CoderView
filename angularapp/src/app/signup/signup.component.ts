import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth-service.service';
import { PasswordConfirmationValidatorService } from '../_services/password-confirmation-validator.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';

@Component({
	selector: 'app-signup',
	templateUrl: './signup.component.html',
	styleUrls: ['./signup.component.css'],
})
export class SignUpComponent implements OnInit {
	registerForm!: FormGroup;

	errorMessage = '';
	isLoginFailed = false;
	isLoading = false;

	constructor(private authService: AuthService,
		private passwordConfirmationValidator: PasswordConfirmationValidatorService,
		private router: Router) { }

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
		this.isLoginFailed = false;
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
					this.router.navigate(['/']);
				} else {
					this.errorMessage = '';
					const errors = Object.values(data.errors);
					errors.map((m: any) => {
						this.errorMessage += m.description + '<br>';
					});
					this.errorMessage.slice(0, -4);
					this.isLoginFailed = true;
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
