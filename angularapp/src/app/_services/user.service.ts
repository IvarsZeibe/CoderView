import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';

const AUTH_API = '/api/';

const httpOptions = {
	headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

export type MyComment = {
	postTitle: string,
	postId: string,
	commentId: string,
	commentContent: string,
	createdOn: Date,
	voteCount: number
}

export type MyPost = {
	id: string,
	title: string,
	createdOn: Date,
	commentCount: number
	voteCount: number
}

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

	getCommentHistory() {
		return this.http.get<MyComment[]>(
			AUTH_API + 'profile/comments',
			httpOptions
		).pipe(
			map(response => response.map(c => Object.assign(c, { createdOn: new Date(c.createdOn) })))
		);
	}

	getPostHistory() {
		return this.http.get<MyPost[]>(
			AUTH_API + 'profile/posts',
			httpOptions
		).pipe(
			map(response => response.map(p => Object.assign(p, { createdOn: new Date(p.createdOn) })))
		);
	}

	deleteAccount() {
		return this.http.post(
			AUTH_API + 'profile/delete',
			httpOptions
		);
	}
}
