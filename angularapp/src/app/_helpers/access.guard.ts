import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { StorageService } from '../_services/storage.service';

@Injectable({
	providedIn: 'root',
})
export class AccessGuard implements CanActivate {
	constructor(private storageService: StorageService, private router: Router) { }

	canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
		const requiresLogin = route.data['requiresLogin'] || false;
		if (requiresLogin) {
			if (!this.storageService.isLoggedIn()) {
				this.router.navigate(['/signin'], { queryParams: { returnUrl: state.url } });
				return false;
			}
		}
		const guestOnly = route.data['guestOnly'] || false;
		if (guestOnly) {
			if (this.storageService.isLoggedIn()) {
				this.router.navigate(['/'], { queryParams: { returnUrl: state.url } });
				return false;
			}
		}
		return true;
	}
}
