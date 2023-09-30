import { Component, OnInit } from '@angular/core';
import { StorageService } from '../_services/storage.service';
import { AuthService } from '../_services/auth-service.service';

@Component({
	selector: 'app-nav-menu',
	templateUrl: './nav-menu.component.html',
	styleUrls: ['./nav-menu.component.css'],
})
export class NavMenuComponent implements OnInit {
	isLoggedIn = false;

	constructor(private storageService: StorageService, private authService: AuthService) { }

	ngOnInit(): void {
		window.addEventListener('storage', (event) => {
			if (event.storageArea == localStorage) {
				this.isLoggedIn = this.storageService.isLoggedIn();
			}
		}, false);

		this.isLoggedIn = this.storageService.isLoggedIn();
	}

	logout(): void {
		this.storageService.clean();
		this.isLoggedIn = false;
		this.authService.logout().subscribe({
			error: err => {
				console.log(err);
			}
		});
	}
}
