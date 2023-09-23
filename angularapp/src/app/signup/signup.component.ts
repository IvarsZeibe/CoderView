import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth-service.service';
import { PasswordConfirmationValidatorService } from '../_services/password-confirmation-validator.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
	selector: 'app-signup',
	templateUrl: './signup.component.html',
	styleUrls: ['./signup.component.css'],
})
export class SignUpComponent implements OnInit {
	registerForm!: FormGroup;

	errorMessage = '';
	showError = false;

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

		this.registerForm.get('confirmPassword')!.setValidators([Validators.required,
			this.passwordConfirmationValidator.validateConfirmPassword(this.registerForm.get('password')!)]);
	}

	onSubmit(): void {
		this.showError = false;
		const { username, email, password } = this.registerForm.value;

		this.authService.register(username, email, password).subscribe({
			next: data => {
				console.log(data);
				if (data.succeeded) {
					this.router.navigate(['/']);
				} else {
					this.errorMessage = '';
					const errors = Object.values(data.errors);
					errors.map((m: any) => {
						this.errorMessage += m.description + '<br>';
					});
					this.errorMessage.slice(0, -4);
					this.showError = true;
				}
			},
			error: err => {
				this.errorMessage = err.error.message;
			}
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
