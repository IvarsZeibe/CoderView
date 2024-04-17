import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService } from '../_services/storage.service';
import { PostService, PostType } from '../_services/post.service';
import { DateHelperService } from '../_services/date-helper.service';
import { PostContentService } from '../_services/post-content.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { GuideFormattingService } from '../_services/guide-formatting.service';
import { ThemeService } from '../_services/theme.service';

@Component({
	selector: 'app-post',
	templateUrl: './post.component.html',
	styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {
	postId = "";
	title = "";
	description? = "";
	author = "";
	content = "";
	voteCount = 0;
	isVotedByUser = false;
	postCreatedOn: Date | null = null;
	timeOnPageLoad = new Date();
	postType: PostType = 'discussion';
	postTags: string[] = [];
	editorOptions = { theme: 'vs-dark', language: '', readOnly: true, automaticLayout: true };
	commentCount = 0;
	isOwnPost = false;

	constructor(
		private route: ActivatedRoute,
		private storageService: StorageService,
		private router: Router,
		private postService: PostService,
		public dateHelperService: DateHelperService,
		private postContentService: PostContentService,
		private snackBar: MatSnackBar,
		public guideFormattingService: GuideFormattingService,
		private themeService: ThemeService
	) { }

	ngOnInit(): void {
		this.postId = this.route.snapshot.paramMap.get('id')!;
		this.postService.get(this.postId).subscribe({
			next: postData => {
				this.isOwnPost = postData.author.toLowerCase() == this.storageService.getUsername()?.toLowerCase();
				this.title = postData.title;
				this.author = postData.author;
				this.description = postData.description;
				this.content = postData.content;
				this.voteCount = postData.voteCount;
				this.isVotedByUser = postData.isVotedByUser;
				this.postCreatedOn = postData.createdOn;
				this.postType = postData.postType;
				this.postTags = postData.tags;
				this.editorOptions.language = postData.programmingLanguage || '';
			},
			error: () => this.router.navigate(['/posts'])
		});
		this.editorOptions = { ...this.editorOptions, theme: this.themeService.isLightTheme.observed ? 'vs-light' : 'vs-dark' }
		this.themeService.isLightTheme.subscribe({
			next: isLightTheme => {
				this.editorOptions = { ...this.editorOptions, theme: isLightTheme ? 'vs-light' : 'vs-dark' };
			}
		});
	}
	updateCommentCount(commentCount: number) {
		this.commentCount = commentCount;
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
		this.postContentService.savePostContent({
			content: this.content,
			description: this.description,
			tags: this.postTags,
			title: this.title,
			postType: this.postType,
			programmingLanguage: this.editorOptions.language
		});
	}

	filterByTag(tag: string) {
		this.router.navigate(['/posts'], { queryParams: { tag, type: this.postType } });
	}

	openCopySnackBar() {
		this.snackBar.open("Saved to clipboard", "Close");
	}
}
