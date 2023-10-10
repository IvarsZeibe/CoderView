import { Component, OnInit } from '@angular/core';
import { StorageService } from '../_services/storage.service';
import { AuthService } from '../_services/auth-service.service';

@Component({
	selector: 'app-nav-menu',
	templateUrl: './nav-menu.component.html',
	styleUrls: ['./nav-menu.component.css'],
})
export class NavMenuComponent implements OnInit {
	constructor(public storageService: StorageService, private authService: AuthService) { }

	ngOnInit(): void {
		// refreshes login state when it is changed from other tab
		window.addEventListener('storage', () => null);
	}

	logout(): void {
		this.storageService.clean();
		this.authService.logout().subscribe({
			error: err => {
				console.log(err);
			}
		});
	}
}
