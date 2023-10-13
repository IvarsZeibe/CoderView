import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService } from '../_services/storage.service';
import { PostService } from '../_services/post.service';
import { Comments } from '../comment-section/comment-section.component';
import { DateHelperService } from '../_services/date-helper.service';
import { PostContentService } from '../_services/post-content.service';

@Component({
	selector: 'app-post',
	templateUrl: './post.component.html',
	styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {
	postId = "";
	title = "";
	author = "";
	content = "";
	voteCount = 0;
	isVotedByUser = false;
	postCreatedOn: Date | null = null;
	timeOnPageLoad = new Date();
	postType: 'snippet' | 'discussion' = 'discussion';
	postTags: string[] = [];

	comments: Comments = {};

	isOwnPost = false;

	constructor(
		private route: ActivatedRoute,
		private storageService: StorageService,
		private router: Router,
		private postService: PostService,
		public dateHelperService: DateHelperService,
		private postContentService: PostContentService
	) { }

	ngOnInit(): void {
		this.postId = this.route.snapshot.paramMap.get('id')!;
		this.postService.get(this.postId).subscribe({
			next: postData => {
				this.isOwnPost = postData.author == this.storageService.getUsername();
				this.title = postData.title;
				this.author = postData.author;
				this.content = postData.content;
				this.voteCount = postData.voteCount;
				this.isVotedByUser = postData.isVotedByUser;
				this.postCreatedOn = postData.createdOn;
				this.postType = postData.postType;
				this.postTags = postData.tags;
				for (const comment of postData.comments) {
					this.comments[comment.id] = {
						owner: comment.author ?? "[Deleted]",
						content: comment.content ?? "",
						replyTo: comment.replyTo,
						depth: comment.replyTo ? this.comments[comment.replyTo].depth + 1 : 0,
						voteCount: comment.voteCount,
						isVotedByUser: comment.isVotedByUser,
						createdOn: comment.createdOn
					};
				}
			},
			error: () => this.router.navigate(['/posts'])
		})
	}

	getCommentCount(): number {
		return Object.keys(this.comments).length;
	}

	voteOnPost() {
		if (!this.storageService.isLoggedIn()) {
			this.router.navigate(['/signin'], { queryParams: { returnUrl: this.router.url } });
		}
		if (!this.isVotedByUser) {
			this.voteCount++;
			this.isVotedByUser = true;
			this.postService.voteOn(this.postId);
		} else {
			this.voteCount--;
			this.isVotedByUser = false;
			this.postService.unvoteOn(this.postId);
		}
	}

	getFormattedAuthor(author: string) {
		if (this.isOwnPost) {
			author += ' (You)';
		}
		return author;
	}

	savePostInfo() {
		this.postContentService.savePostContent({ content: this.content, tags: this.postTags, title: this.title, postType: this.postType });
	}

	filterByTag(tag: string) {
		this.router.navigate(['/posts'], { queryParams: { tag, type: this.postType } });
	}
}
