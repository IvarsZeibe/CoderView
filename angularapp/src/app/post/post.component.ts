import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService } from '../_services/storage.service';
import { PostsService } from '../_services/posts.service';
import { FormControl } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

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
	commentDepthColors = ["red", "orange", "green", "purple"];

	// key is -2 for new comment while the server hasn't returned the id of the newly created comment
	comments: Record<number | -2, {
		owner: string,
		content: string,
		replyTo: number | null,
		depth: number,
		voteCount: number,
		isVotedByUser: boolean
	}> = {};

	// key is -1 for comment on post
	repliesInProgress: Record<number | -1, FormControl<string>> = {};
	constructor(
		private route: ActivatedRoute,
		private storageService: StorageService,
		private router: Router,
		private postsService: PostsService,
		private dialog: MatDialog
	) { }

	ngOnInit(): void {
		this.postId = this.route.snapshot.paramMap.get('id')!;
		this.postsService.getPostData(this.postId).subscribe(postData => {
			this.title = postData.title;
			this.author = postData.author;
			this.content = postData.content;
			this.voteCount = postData.voteCount;
			this.isVotedByUser = postData.isVotedByUser;
			for (const comment of postData.comments) {
				this.comments[comment.id] = {
					content: comment.content ?? "[Deleted]",
					owner: comment.author ?? "",
					replyTo: comment.replyTo,
					depth: comment.replyTo ? this.comments[comment.replyTo].depth + 1 : 0,
					voteCount: comment.voteCount,
					isVotedByUser: comment.isVotedByUser
				};
			}
		})
	}

	getCommentCount(): number {
		return Object.keys(this.comments).length;
	}

	getCommentColor(depth: number): string {
		depth = depth % this.commentDepthColors.length;
		return this.commentDepthColors[depth];
	}

	getOrderedCommentIds(): number[] {
		let currentDepth = 0;
		const orderedCommentIds: number[] = [];
		for (let i = 0; i < currentDepth + 1; i++) {
			let areCommentsInThisDepthFound = false;
			for (const commentIdString of Object.keys(this.comments).reverse()) {
				const commentId = parseInt(commentIdString);
				if (this.comments[commentId].depth == currentDepth) {
					areCommentsInThisDepthFound = true;
					if (this.comments[commentId].replyTo) {
						const parentIndex = orderedCommentIds.indexOf(this.comments[commentId].replyTo!);
						orderedCommentIds.splice(parentIndex + 1, 0, commentId);
					} else {
						orderedCommentIds.push(commentId);
					}
				}
			}
			if (areCommentsInThisDepthFound) {
				currentDepth++;
			}
		}
		return orderedCommentIds;
	}

	startReply(commentId: number): void {
		if (!this.storageService.isLoggedIn()) {
			this.router.navigate(['/signin']);
		}
		this.repliesInProgress[commentId] = new FormControl("", { nonNullable: true });
	}

	cancelReply(commentId: number): void {
		delete this.repliesInProgress[commentId];
	}

	submitReply(replyTo: number | -1): void {
		this.repliesInProgress[replyTo].setValue(this.repliesInProgress[replyTo].value.trim());
		if (this.repliesInProgress[replyTo].value.length == 0) {
			this.repliesInProgress[replyTo].setErrors({ required: true });
			return;
		} else if (this.repliesInProgress[replyTo].value.length > 5000) {
			this.repliesInProgress[replyTo].setErrors({ tooLong: true });
			return;
		}
		this.comments[-2] = {
			content: this.repliesInProgress[replyTo].value,
			depth: replyTo == -1 ? 0 : this.comments[replyTo].depth + 1,
			owner: this.storageService.getUsername(),
			replyTo: replyTo == -1 ? null : replyTo,
			voteCount: 0,
			isVotedByUser: false
		}
		this.postsService.submitComment(this.repliesInProgress[replyTo].value, this.postId, replyTo == -1 ? null : replyTo).subscribe({
			next: commentId => {
				const id = commentId.toString();
				this.comments[id] = this.comments[-2];
				delete this.comments[-2];
			}
		})
		delete this.repliesInProgress[replyTo];
	}

	voteOnPost() {
		if (!this.storageService.isLoggedIn()) {
			this.router.navigate(['/signin']);
		}
		if (!this.isVotedByUser) {
			this.voteCount++;
			this.isVotedByUser = true;
			this.postsService.voteOnPost(this.postId);
		} else {
			this.voteCount--;
			this.isVotedByUser = false;
			this.postsService.unvoteOnPost(this.postId);
		}
	}

	voteOnComment(commentId: number) {
		if (!this.storageService.isLoggedIn()) {
			this.router.navigate(['/signin']);
		}
		if (!this.comments[commentId].isVotedByUser) {
			this.comments[commentId].voteCount++;
			this.comments[commentId].isVotedByUser = true;
			this.postsService.voteOnComment(commentId);
		} else {
			this.comments[commentId].voteCount--;
			this.comments[commentId].isVotedByUser = false;
			this.postsService.unvoteOnComment(commentId);
		}
	}

	isCommentShortened(element: HTMLElement) {
		return element.offsetHeight < element.scrollHeight && element.style.display == "";
	}

	isCommentExpanded(element: HTMLElement) {
		return element.style.display == "block";
	}

	expandComment(element: HTMLElement) {
		element.style.display = "block";
	}

	shortenComment(element: HTMLElement) {
		element.style.display = "";
	}

	isCommentedByCurrentUser(commentId: number) {
		return this.comments[commentId].owner == this.storageService.getUsername();
	}

	openDeleteCommentDialog(commentId: number) {
		this.dialog.open(DeleteCommentDialogComponent, {
			data: () => {
				this.postsService.deleteComment(commentId);
				
				if (!Object.values(this.comments).some(c => c.replyTo == commentId)) {
					// eslint-disable-next-line no-constant-condition
					while (true) {
						const parentId: number | null = this.comments[commentId].replyTo;

						delete this.comments[commentId];

						if (parentId !== null &&
							this.comments[parentId].content === "[Deleted]" &&
							!Object.values(this.comments).some(c => c.replyTo == parentId)
						) {
							commentId = parentId;
						} else {
							break;
						}
					}
					delete this.comments[commentId];
				} else {
					this.comments[commentId].content = "[Deleted]";
					this.comments[commentId].owner = "";
				}
			}
		});
	}
}

@Component({
	selector: 'app-delete-comment-dialog',
	template: `<h1 mat-dialog-title>Delete comment</h1>
<div mat-dialog-content>
  Are you sure you want to delete this comment?
</div>
<div mat-dialog-actions>
  <button mat-button mat-dialog-close cdkFocusInitial>Cancel</button>
  <button mat-button (click)="deleteComment()" mat-dialog-close cdkFocusInitial>Delete</button>
</div>`,
	standalone: true,
	imports: [MatDialogModule, MatButtonModule],
})
export class DeleteCommentDialogComponent {
	constructor(@Inject(MAT_DIALOG_DATA) public deleteComment: () => void) { }
}
