import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, firstValueFrom, map } from 'rxjs';

const AUTH_API = '/api/';

const httpOptions = {
	headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

export type PostSummary = {
	id: string,
	title: string,
	content: string,
	author: string,
	commentCount: number,
	voteCount: number,
	isVotedByUser: boolean,
	createdOn: Date
};

export type PostData = {
	id: string,
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

export enum SortOrder {
	Ascending,
	Descending
}

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

	public getPosts(titleSearchFilter = '', timeStamp: Date | null = null, sortOrder: SortOrder = SortOrder.Descending) {
		const urlSearchParams = new URLSearchParams();
		if (titleSearchFilter != '') {
			urlSearchParams.append('titleSearchFilter', titleSearchFilter);
		}
		if (timeStamp != null) {
			urlSearchParams.append('timeStamp', timeStamp.toISOString());
		}
		urlSearchParams.append('sortOrder', sortOrder.toString());
		return this.http.get <PostSummary[]>(
			AUTH_API + 'posts?' + urlSearchParams.toString(),
			httpOptions
		).pipe(
			map(response => response.map(p => Object.assign(p, { createdOn: new Date(p.createdOn) })))
		);
	}

	public getPostData(id: string) {
		return this.http.get<PostData>(
			AUTH_API + 'post/' + id,
			httpOptions
		);
	}

	public submitComment(content: string, postId: string, replyTo: number | null): Observable<any> {
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

	public voteOnPost(postId: string) {
		firstValueFrom(this.http.post(
			AUTH_API + 'post/vote/' + postId,
			{},
			httpOptions
		));
	}

	public unvoteOnPost(postId: string) {
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
