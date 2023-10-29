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
	content: string,
	author: string,
	voteCount: number,
	isVotedByUser: boolean,
	createdOn: Date,
	postType: 'snippet' | 'discussion',
	tags: string[],
	comments: {
		id: number,
		author: string | null,
		content: string | null,
		replyTo: number | null,
		voteCount: number,
		isVotedByUser: boolean,
		createdOn: Date
	}[],
	programmingLanguage: string | null
};

export enum SortOrder {
	Ascending,
	Descending
}

export type PostType = 'discussion' | 'snippet';

@Injectable({
  providedIn: 'root'
})
export class PostService {
	constructor(private http: HttpClient) { }

	public createNew(postType: PostType, title: string, content: string, tags: string[], programmingLanguage: string | null = null): Observable<any> {
		return this.http.post(
			AUTH_API + 'post/create',
			{
				title,
				content,
				postType,
				tags,
				programmingLanguage
			},
			httpOptions
		);
	}

	public getAll(
		postType: PostType, titleSearchFilter = '',
		filteredTags: string[] = [],
		programmingLanguageFilter: string | null,
		timeStamp: Date | null = null,
		sortOrder: SortOrder = SortOrder.Descending
	) {
		const urlSearchParams = new URLSearchParams();
		if (titleSearchFilter != '') {
			urlSearchParams.append('titleSearchFilter', titleSearchFilter);
		}
		if (filteredTags.length != 0) {
			for (const tag of filteredTags) {
				urlSearchParams.append('filteredTags', tag);
			}
		}
		if (timeStamp != null) {
			urlSearchParams.append('timeStamp', timeStamp.toISOString());
		}
		urlSearchParams.append('sortOrder', sortOrder.toString());
		if (programmingLanguageFilter != null) {
			urlSearchParams.append('programmingLanguageFilter', programmingLanguageFilter);
		}

		urlSearchParams.append('postType', postType);
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
				createdOn: new Date(p.createdOn),
				comments: p.comments.map(c => Object.assign(c, { createdOn: new Date(c.createdOn) }))
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

	public savePostChanges(id: string, title: string, content: string, tags: string[], programmingLanguage: string | null = null) {
		return this.http.post(
			AUTH_API + 'post/' + id + '/edit',
			{
				title,
				content,
				tags,
				programmingLanguage
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
}
