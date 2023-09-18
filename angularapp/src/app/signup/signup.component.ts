import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth-service.service';

@Component({
	selector: 'app-signup',
	templateUrl: './signup.component.html',
})
export class SignUpComponent implements OnInit {
	form: any = {
		username: null,
		email: null,
		password: null,
		repeatPassword: null
	};
	isSuccessful = false;
	isSignUpFailed = false;
	errorMessage = '';

	constructor(private authService: AuthService) { }

	ngOnInit(): void {
		this.form.username = "";
		this.form.email = "";
		this.form.password = "";
		this.form.repeatPassword = "";
	}

	onSubmit(): void {
		const { username, email, password, repeatPassword } = this.form;

		this.authService.register(username, email, password, repeatPassword).subscribe({
			next: data => {
				console.log(data);
				this.isSuccessful = true;
				this.isSignUpFailed = false;
			},
			error: err => {
				this.errorMessage = err.error.message;
				this.isSignUpFailed = true;
			}
		});
	}
}
