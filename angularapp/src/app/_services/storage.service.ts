import { Injectable } from '@angular/core';

const USER_KEY = 'auth-user';

@Injectable({
	providedIn: 'root'
})
export class StorageService {

	clean(): void {
		window.localStorage.clear();
	}

	public saveUser(user: any): void {
		window.localStorage.removeItem(USER_KEY);
		window.localStorage.setItem(USER_KEY, user.toLowerCase());
	}

	public getUsername(): any {
		return window.localStorage.getItem(USER_KEY);
	}

	public isLoggedIn(): boolean {
		const user = window.localStorage.getItem(USER_KEY);
		if (user) {
			return true;
		}

		return false;
	}
}
