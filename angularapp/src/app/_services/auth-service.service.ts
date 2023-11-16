import { Injectable, Injector } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ActivatedRoute, Router, RouterStateSnapshot } from '@angular/router';

//const AUTH_API = 'http://localhost:8080/api/auth/';
const AUTH_API = '/api/';

const httpOptions = {
	headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
	providedIn: 'root',
})
export class AuthService {
	constructor(
		private http: HttpClient,
		private route: ActivatedRoute,
		private router: Router,
		private injector: Injector
	) { }

	isLoggedIn(): Observable<any> {
		return this.http.post(
			AUTH_API + 'isAuthenticated',
			{},
			httpOptions
		);
	}

	login(username: string, password: string): Observable<boolean> {
		return this.http.post<boolean>(
			AUTH_API + 'signin',
			{
				username,
				password,
			},
			httpOptions
		);
	}

	register(username: string, email: string, password: string): Observable<any> {
		return this.http.post(
			AUTH_API + 'signup',
			{
				username,
				email,
				password,
			},
			httpOptions
		);
	}

	logout(): Observable<any> {
		const response = this.http.post(AUTH_API + 'signout', {}, httpOptions);
		this.forceRunAuthGuard();
		return response;
	}

	forceRunAuthGuard() {
		if (this.route.root.children.length) {
			const currentRoute = this.route.root.children['0'];
			const canActivate = currentRoute?.snapshot.routeConfig?.canActivate;
			if (canActivate == null) {
				return;
			}
			const authGuard = this.injector.get(canActivate['0']);
			const routerStateSnapshot: RouterStateSnapshot = Object.assign({}, currentRoute.snapshot, { url: this.router.url });
			authGuard.canActivate(currentRoute.snapshot, routerStateSnapshot);
		}
	}

	getRoles(): Observable<string[]> {
		return this.http.get<string[]>(AUTH_API + 'roles');
	}
}
