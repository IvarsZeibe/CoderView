import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, firstValueFrom } from 'rxjs';

const AUTH_API = '/api/';

const httpOptions = {
	headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

export type PostSummary = {
	id: number,
	title: string,
	content: string,
	author: string,
	commentCount: number,
	voteCount: number,
	isVotedByUser: boolean
};

export type PostData = {
	id: number,
	title: string,
	content: string,
	author: string,
	voteCount: number,
	isVotedByUser: boolean
	comments: {
		id: number,
		author: string,
		content: string,
		replyTo: number | null,
		voteCount: number,
		isVotedByUser: boolean
	}[],
};

@Injectable({
  providedIn: 'root'
})
export class PostsService {
	constructor(private http: HttpClient) { }

	public createNewPost(title: string, content: string): Observable<any> {
		return this.http.post(
			AUTH_API + 'new_post',
			{
				title,
				content
			},
			httpOptions
		);
	}

	public getAllPosts() {
		return this.http.get <PostSummary[]>(
			AUTH_API + 'posts',
			httpOptions
		);
	}

	public getPostData(id: number) {
		return this.http.get<PostData>(
			AUTH_API + 'post/' + id,
			httpOptions
		);
	}

	public submitComment(content: string, postId: number, replyTo: number | null): Observable<any> {
		return this.http.post(
			AUTH_API + 'comment',
			{
				content,
				postId,
				replyTo
			},
			httpOptions
		);
	}

	public voteOnPost(postId: number) {
		firstValueFrom(this.http.post(
			AUTH_API + 'post/vote/' + postId,
			{},
			httpOptions
		));
	}

	public unvoteOnPost(postId: number) {
		firstValueFrom(this.http.post(
			AUTH_API + 'post/unvote/' + postId,
			{},
			httpOptions
		));
	}

	public voteOnComment(commentId: number) {
		firstValueFrom(this.http.post(
			AUTH_API + 'comment/vote/' + commentId,
			{},
			httpOptions
		));
	}

	public unvoteOnComment(commentId: number) {
		firstValueFrom(this.http.post(
			AUTH_API + 'comment/unvote/' + commentId,
			{},
			httpOptions
		));
	}
}
