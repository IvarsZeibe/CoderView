import { Component, OnInit } from '@angular/core';
import { AuthService } from '../_services/auth-service.service';
import { StorageService } from '../_services/storage.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { finalize, of, switchMap } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
	selector: 'app-signin',
	templateUrl: './signin.component.html',
	styleUrls: ['./signin.component.css']
})
export class SignInComponent implements OnInit {
	loginForm!: FormGroup;
	isLoginFailed = false;
	isLoading = false;

	constructor(
		private authService: AuthService,
		private storageService: StorageService,
		private router: Router,
		private route: ActivatedRoute
	) { }

	ngOnInit(): void {
		this.loginForm = new FormGroup({
			username: new FormControl('', [Validators.required]),
			password: new FormControl('', [Validators.required]),
		});
	}

	onSubmit(): void {
		const { username, password } = this.loginForm.value;
		let formattedUsername = '';
		this.isLoading = true;
		let roles: string[];

		this.authService.login(username, password)
			.pipe(
				switchMap(username => {
					formattedUsername = username;
					this.isLoginFailed = !username;
					return username ? this.authService.getRoles() : of([]);
				}),
				finalize(() => {
					if (!this.isLoginFailed) {
						this.storageService.saveUser(formattedUsername, roles);
						const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
						this.router.navigateByUrl(returnUrl);
					}
					this.isLoading = false;
				})
		).subscribe(r => roles = r);
	}
}
