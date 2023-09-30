import { Component, OnInit } from '@angular/core';
import { StorageService } from './_services/storage.service';
import { AuthService } from './_services/auth-service.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
	constructor(private storageService: StorageService, private authService: AuthService) { }

	ngOnInit(): void {
		this.authService.isLoggedIn().subscribe(isLoggedIn => {
			if (!isLoggedIn && this.storageService.isLoggedIn()) {
				this.storageService.clean();
				window.dispatchEvent(new StorageEvent('storage', {
					storageArea: localStorage
				}));
			}
		})
    }
	
}
