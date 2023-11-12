import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, firstValueFrom, map } from 'rxjs';
import { PostContent } from './post-content.service';

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
	createdOn: Date,
	tags: string[],
	programmingLanguage: string | null
};

export type PostData = {
	id: string,
	title: string,
	description?: string,
	content: string,
	author: string,
	voteCount: number,
	isVotedByUser: boolean,
	createdOn: Date,
	postType: PostType,
	tags: string[],
	programmingLanguage: string | null
};

export type Comments = {
	id: number,
	author: string | null,
	content: string | null,
	replyTo: number | null,
	voteCount: number,
	isVotedByUser: boolean,
	createdOn: Date
}[];

export enum SortOrder {
	Ascending,
	Descending
}

export type PostType = PostService['postTypes'][number]['value'];

@Injectable({
	providedIn: 'root'
})
export class PostService {
	postTypes = [
		{ value: "discussion", viewValue: "Discussions" },
		{ value: "snippet", viewValue: "Code snippets" },
		{ value: "guide", viewValue: "Guide" }
	] as const;

	constructor(private http: HttpClient) { }

	public createNew(postType: PostType, title: string, content: string, tags: string[], programmingLanguage: string | null = null, description?: string): Observable<any> {
		return this.http.post(
			AUTH_API + 'post/create',
			{
				title,
				content,
				description,
				postType,
				tags,
				programmingLanguage
			},
			httpOptions
		);
	}

	public getAll(filters: {
		postType: PostType,
		title?: string,
		tags?: string[],
		programmingLanguage?: string,
		timeStamp?: Date,
		sortOrder?: SortOrder
	}) {
		const urlSearchParams = new URLSearchParams();
		if (filters.title) {
			urlSearchParams.append('titleSearchFilter', filters.title);
		}

		if (filters.tags) {
			for (const tag of filters.tags) {
				urlSearchParams.append('filteredTags', tag);
			}
		}

		if (filters.timeStamp) {
			urlSearchParams.append('timeStamp', filters.timeStamp.toISOString());
		}

		if (!filters.sortOrder) {
			filters.sortOrder = SortOrder.Descending;
		}
		urlSearchParams.append('sortOrder', filters.sortOrder.toString());

		if (filters.programmingLanguage) {
			urlSearchParams.append('programmingLanguageFilter', filters.programmingLanguage);
		}

		urlSearchParams.append('postType', filters.postType);

		return this.http.get <PostSummary[]>(
			AUTH_API + 'post/all?' + urlSearchParams.toString(),
			httpOptions
		).pipe(
			map(response => response.map(p => Object.assign(p, { createdOn: new Date(p.createdOn) })))
		);
	}

	public get(id: string) {
		return this.http.get<PostData>(
			AUTH_API + 'post/' + id,
			httpOptions
		).pipe(
			map(p => Object.assign(p, {
				createdOn: new Date(p.createdOn)
			}))
		);
	}

	public voteOn(postId: string) {
		firstValueFrom(this.http.post(
			AUTH_API + 'post/' + postId + '/vote',
			{},
			httpOptions
		));
	}

	public unvoteOn(postId: string) {
		firstValueFrom(this.http.post(
			AUTH_API + 'post/' + postId + '/unvote',
			{},
			httpOptions
		));
	}

	public getAllTags() {
		return this.http.get<string[]>(
			AUTH_API + 'tags',
			httpOptions
		);
	}

	public getPostContent(id: string) {
		return this.http.get<PostContent>(
			AUTH_API + 'post/' + id + '/content',
			httpOptions
		);
	}

	public savePostChanges(id: string, title: string, content: string, tags: string[], programmingLanguage?: string, description?: string) {
		return this.http.post(
			AUTH_API + 'post/' + id + '/edit',
			{
				title,
				content,
				tags,
				programmingLanguage,
				description
			},
			httpOptions
		);
	}

	public delete(id: string) {
		return this.http.delete(
			AUTH_API + 'post/' + id + '/delete',
			{}
		);
	}

	public getComments(postId: string) {
		return this.http.get<Comments>(
			AUTH_API + 'post/' + postId + '/comments',
			httpOptions
		).pipe(
			map(response => response.map(c => Object.assign(c, { createdOn: new Date(c.createdOn) })))
		);
	}
}
