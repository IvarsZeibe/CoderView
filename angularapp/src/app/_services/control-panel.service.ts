import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs';
import { PostType } from './post.service';

const AUTH_API = '/api/controlPanel/';

const httpOptions = {
	headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

export type PostData = { id: string, title: string, postType: PostType, author: string, commentCount: number, voteCount: number, createdOn: Date };
export type CommentData = { id: string, content: string | null, postTitle: string, postId: string, author: string | null, replyCount: number, voteCount: number, createdOn: Date };
export type UserData = { id: string, username: string, email: string, isAdmin: boolean, commentCount: number, postCount: number, createdOn: Date };

@Injectable({
	providedIn: 'root'
})
export class ControlPanelService {
	constructor(private http: HttpClient) { }

	getPosts() {
		return this.http.get<PostData[]>(
			AUTH_API + 'posts',
			httpOptions
		).pipe(
			map(response => response.map(p => Object.assign(p, { createdOn: new Date(p.createdOn) })))
		);
	}

	getComments() {
		return this.http.get<CommentData[]>(
			AUTH_API + 'comments',
			httpOptions
		).pipe(
			map(response => response.map(p => Object.assign(p, { createdOn: new Date(p.createdOn) })))
		);
	}

	getUsers() {
		return this.http.get<UserData[]>(
			AUTH_API + 'users',
			httpOptions
		).pipe(
			map(response => response.map(p => Object.assign(p, { createdOn: new Date(p.createdOn) })))
		);
	}

	deletePost(postId: string) {
		return this.http.delete(AUTH_API + 'post/' + postId + '/delete');
	}

	deleteComment(commentId: string) {
		return this.http.delete(AUTH_API + 'comment/' + commentId + '/delete');
	}

	deleteUser(userId: string) {
		return this.http.delete(AUTH_API + 'user/' + userId + '/delete');
	}

	resetPassword(userId: string) {
		return this.http.post<{value: string}>(AUTH_API + 'user/' + userId + '/resetPassword', {});
	}

	grantAdminPrivileges(userId: string) {
		return this.http.post(AUTH_API + 'user/' + userId + '/grantAdmin', {});
	}

	removeAdminPrivileges(userId: string) {
		return this.http.post(AUTH_API + 'user/' + userId + '/removeAdmin', {});
	}
}
