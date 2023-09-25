import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth-service.service';
import { StorageService } from '../_services/storage.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
	selector: 'app-signin',
	templateUrl: './signin.component.html',
	styleUrls: ['./signin.component.css']
})
export class SignInComponent implements OnInit {
	loginForm!: FormGroup;
	isLoginFailed = false;
	roles: string[] = [];

	constructor(private authService: AuthService, private storageService: StorageService) { }

	ngOnInit(): void {
		this.loginForm = new FormGroup({
			username: new FormControl('', [Validators.required]),
			password: new FormControl('', [Validators.required]),
		});
	}

	onSubmit(): void {
		const { username, password } = this.loginForm.value;

		this.authService.login(username, password).subscribe({
			next: hasLoggedIn => {
				if (hasLoggedIn) {
					this.storageService.saveUser(username);
					this.isLoginFailed = false;
					this.roles = this.storageService.getUsername().roles;
					this.reloadPage();
				} else {
					console.log("Log in failed");
					this.isLoginFailed = true;
				}
			}
		});
	}

	reloadPage(): void {
		window.location.reload();
	}
}
