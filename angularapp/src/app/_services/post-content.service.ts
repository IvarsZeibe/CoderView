import { Injectable } from '@angular/core';
import { PostType } from './post.service';

export type PostContent = {
	title: string,
	description?: string,
	content: string,
	tags: string[],
	postType: PostType,
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
