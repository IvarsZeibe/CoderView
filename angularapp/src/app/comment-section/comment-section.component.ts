import { Component, EventEmitter, Input, Output, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { StorageService } from '../_services/storage.service';
import { Router } from '@angular/router';
import { DateHelperService } from '../_services/date-helper.service';
import { CommentService } from '../_services/comment.service';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';
import { PostService } from '../_services/post.service';

export type Comments = Record<number | -2, {
	owner: string,
	content: string,
	replyTo: number | null,
	depth: number,
	voteCount: number,
	isVotedByUser: boolean,
	createdOn: Date
}>;

@Component({
  selector: 'app-comment-section',
  templateUrl: './comment-section.component.html',
  styleUrls: ['./comment-section.component.css']
})
export class CommentSectionComponent implements OnInit {
	@Input({ required: true }) postId!: string;
	@Input() timeOnPageLoad: Date = new Date();
	commentDepthColors = ["red", "orange", "green", "purple"];

	@Output() commentCount = new EventEmitter<number>();

	// key is -2 for new comment while the server hasn't returned the id of the newly created comment
	comments: Comments = {};

	// key is -1 for comment on post
	repliesInProgress: Record<number | -1, FormControl<string>> = {};

	isLoading = true;
	hasFailedToLoadComments = false;

	constructor(
		private storageService: StorageService,
		private router: Router,
		private postService: PostService,
		private commentService: CommentService,
		private dialog: MatDialog,
		public dateHelperService: DateHelperService,
		private changeDetector: ChangeDetectorRef
	) { }

	ngOnInit(): void {
		this.postService.getComments(this.postId).subscribe({
			next: (c) => {
				for (const comment of c) {
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
				this.commentCount.emit(this.getCommentCount());
				this.isLoading = false;
				this.changeDetector.detectChanges();
				queueMicrotask(() => {
					const commentElements = document.getElementsByClassName('comment-content');
					for (let i = 0; i < commentElements.length; i++) {
						const element = commentElements.item(i) as HTMLElement;
						if (element && element.offsetHeight < element.scrollHeight) {
							element.classList.add("long-comment");
						}
					}
				});
			}, error: () => {
				this.hasFailedToLoadComments = true;
				this.isLoading = false;
			}
		})
	}

	getCommentCount(): number {
		return Object.keys(this.comments).length;
	}

	shouldShowNoCommentText(): boolean {
		return this.getCommentCount() == 0 && !this.isLoading && !this.hasFailedToLoadComments && Object.keys(this.repliesInProgress).length == 0;
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
			this.router.navigate(['/signin'], { queryParams: { returnUrl: this.router.url } });
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
			isVotedByUser: false,
			createdOn: new Date()
		}
		this.commentCount.emit(this.getCommentCount());

		this.changeDetector.detectChanges();
		const element = document.getElementById('comment-2') as HTMLElement;
		if (element && element.offsetHeight < element.scrollHeight) {
			element.classList.add("long-comment");
		}

		this.commentService.create(this.repliesInProgress[replyTo].value, this.postId, replyTo == -1 ? null : replyTo).subscribe({
			next: commentId => {
				const id = commentId.toString();
				this.comments[id] = this.comments[-2];
				delete this.comments[-2];

				this.changeDetector.detectChanges();
				const element = document.getElementById('comment' + id) as HTMLElement;
				if (element && element.offsetHeight < element.scrollHeight) {
					element.classList.add("long-comment");
				}
			}
		})
		delete this.repliesInProgress[replyTo];
	}

	voteOnComment(commentId: number) {
		if (!this.storageService.isLoggedIn()) {
			this.router.navigate(['/signin'], { queryParams: { returnUrl: this.router.url } });
		}
		if (!this.comments[commentId].isVotedByUser) {
			this.comments[commentId].voteCount++;
			this.comments[commentId].isVotedByUser = true;
			this.commentService.voteOn(commentId);
		} else {
			this.comments[commentId].voteCount--;
			this.comments[commentId].isVotedByUser = false;
			this.commentService.unvoteOn(commentId);
		}
	}

	isCommentShortened(element: HTMLElement) {
		return element.classList.contains("long-comment") && element.style.display == "";
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
		return this.comments[commentId].owner.toLowerCase() == this.storageService.getUsername();
	}

	openDeleteCommentDialog(commentId: number) {
		this.dialog.open(DeleteDialogComponent, {
			data: {
				deleteAction: () => {
					this.commentService.delete(commentId);

					if (!Object.values(this.comments).some(c => c.replyTo == commentId)) {
						// eslint-disable-next-line no-constant-condition
						while (true) {
							const parentId: number | null = this.comments[commentId].replyTo;

							delete this.comments[commentId];
							this.commentCount.emit(this.getCommentCount());

							if (parentId !== null &&
								this.comments[parentId].owner === "[Deleted]" &&
								!Object.values(this.comments).some(c => c.replyTo == parentId)
							) {
								commentId = parentId;
							} else {
								break;
							}
						}
						delete this.comments[commentId];
					} else {
						this.comments[commentId].owner = "[Deleted]";
						this.comments[commentId].content = "";
					}
				},
				itemToDelete: 'comment'
			}
		});
	}

	getFormattedAuthor(author: string) {
		if (this.storageService.getUsername() == author) {
			author += ' (You)';
		}
		return author;
	}
}
