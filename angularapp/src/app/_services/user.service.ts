import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const AUTH_API = '/api/';

const httpOptions = {
	headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
	providedIn: 'root'
})
export class UserService {
	constructor(private http: HttpClient) { }

	public getUserData(): Observable<any> {
		return this.http.post(AUTH_API + 'profile', {}, httpOptions);
	}

	public changeUsername(username: string): Observable<any> {
		return this.http.post(AUTH_API + 'profile/changeUsername', JSON.stringify(username), httpOptions);
	}

	public changeEmail(email: string): Observable<any> {
		return this.http.post(AUTH_API + 'profile/changeEmail', JSON.stringify(email), httpOptions);
	}

	public changePassword(currentPassword: string, newPassword: string): Observable<any> {
		return this.http.post(
			AUTH_API + 'profile/changePassword',
			{ currentPassword: currentPassword, newPassword: newPassword },
			httpOptions
		);
	}
}
