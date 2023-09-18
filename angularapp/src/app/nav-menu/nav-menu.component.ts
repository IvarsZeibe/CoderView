import { Component, OnInit } from '@angular/core';
import { StorageService } from '../_services/storage.service';
import { AuthService } from '../_services/auth-service.service';

@Component({
	selector: 'app-nav-menu',
	templateUrl: './nav-menu.component.html',
	styleUrls: ['./nav-menu.component.css'],
})
export class NavMenuComponent {
	isLoggedIn = false;
	username?: string;

	constructor(private storageService: StorageService, private authService: AuthService) { }

	ngOnInit(): void {
		this.isLoggedIn = this.storageService.isLoggedIn();

		if (this.isLoggedIn) {
			const user = this.storageService.getUser();

			this.username = user.username;
		}
	}

	logout(): void {
		this.authService.logout().subscribe({
			next: res => {
				console.log(res);
				this.storageService.clean();

				window.location.reload();
			},
			error: err => {
				console.log(err);
			}
		});
	}
}
