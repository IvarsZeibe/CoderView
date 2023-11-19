import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, firstValueFrom } from 'rxjs';

const AUTH_API = '/api/';

const httpOptions = {
	headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
	providedIn: 'root'
})
export class CommentService {
	constructor(private http: HttpClient) { }

	public create(content: string, postId: string, replyTo: string | null): Observable<any> {
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

	public voteOn(commentId: string) {
		firstValueFrom(this.http.post(
			AUTH_API + 'comment/' + commentId + '/vote',
			{},
			httpOptions
		));
	}

	public unvoteOn(commentId: string) {
		firstValueFrom(this.http.post(
			AUTH_API + 'comment/' + commentId + '/unvote',
			{},
			httpOptions
		));
	}

	public delete(commentId: string) {
		firstValueFrom(this.http.delete(
			AUTH_API + 'comment/' + commentId,
			httpOptions
		));
	}
}
