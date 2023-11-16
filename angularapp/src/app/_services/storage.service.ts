import { Injectable } from '@angular/core';

const USER_KEY = 'auth-user';

@Injectable({
	providedIn: 'root'
})
export class StorageService {

	clean(): void {
		window.localStorage.clear();
	}

	public saveUser(user: string, roles: string[]): void {
		window.localStorage.removeItem(USER_KEY);
		window.localStorage.setItem(USER_KEY, JSON.stringify({username: user, roles}));
	}

	public getUsername(): string {
		return this.getUserData()?.username ?? "";
	}

	public isAdministrator(): boolean {
		return !!this.getUserData()?.roles.includes("Administrator");
	}

	private getUserData(): { username: string, roles: string[] } | null {
		const userDataString = window.localStorage.getItem(USER_KEY);
		if (!userDataString) {
			return null;
		}
		return JSON.parse(userDataString);
	}

	public isLoggedIn(): boolean {
		const user = window.localStorage.getItem(USER_KEY);
		if (user) {
			return true;
		}

		return false;
	}
}
