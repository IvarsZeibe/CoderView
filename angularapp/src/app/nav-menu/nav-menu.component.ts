import { Component, OnInit } from '@angular/core';
import { StorageService } from '../_services/storage.service';
import { AuthService } from '../_services/auth-service.service';
import { animate, state, style, transition, trigger } from '@angular/animations';

@Component({
	selector: 'app-nav-menu',
	templateUrl: './nav-menu.component.html',
	styleUrls: ['./nav-menu.component.css'],
	animations: [
		trigger('expand', [
			state('void', style({ transform: 'scale(0.5)' })),
			transition(':enter', [
				animate(300, style({ transform: 'scale(1)' })),
			]),
		]),
	],
})
export class NavMenuComponent implements OnInit {
	isAnimationDisabled = true;

	constructor(public storageService: StorageService, private authService: AuthService) {
		queueMicrotask(() => { this.isAnimationDisabled = false; });
	}

	ngOnInit(): void {
		// refreshes login state when it is changed from other tab
		window.addEventListener('storage', () => this.authService.forceRunAuthGuard());
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
