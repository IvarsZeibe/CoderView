import { Injectable } from '@angular/core';

export type PostContent = {
	title: string,
	content: string,
	tags: string[],
	postType: 'discussion' | 'snippet',
	programmingLanguage: string | null
};

@Injectable({
  providedIn: 'root'
})
export class PostContentService {
	_postContent: PostContent | undefined;

	savePostContent(postContent: PostContent) {
		this._postContent = postContent
	}

	getPostContent = () => this._postContent;

	clear = () => this._postContent = undefined;
}
