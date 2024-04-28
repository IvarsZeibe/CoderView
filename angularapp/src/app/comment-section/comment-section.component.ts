import { Component, EventEmitter, Input, Output, OnInit, ChangeDetectorRef } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { StorageService } from '../_services/storage.service';
import { Router } from '@angular/router';
import { DateHelperService } from '../_services/date-helper.service';
import { CommentService } from '../_services/comment.service';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';
import { PostService } from '../_services/post.service';
import { MatSnackBar } from '@angular/material/snack-bar';

export type Comments = Record<string, {
	owner: string,
	content: string,
	replyTo: string | null,
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

	comments: Comments = {};

	// key 'post' is for comment on post not reply to other comment
	repliesInProgress: Record<string | 'post', FormControl<string>> = {};
	editsInProgress: string[] = [];

	isLoading = true;
	hasFailedToLoadComments = false;

	constructor(
		private storageService: StorageService,
		private router: Router,
		private postService: PostService,
		private commentService: CommentService,
		private dialog: MatDialog,
		public dateHelperService: DateHelperService,
		private changeDetector: ChangeDetectorRef,
		private snackBar: MatSnackBar
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

	getOrderedCommentIds(): string[] {
		const orderedCommentIds: string[] = [];
		const oldestToNewest = Object.entries(this.comments).sort((first, second) => first[1].createdOn.valueOf() - second[1].createdOn.valueOf());
		for (const [commentId, commentValue] of oldestToNewest) {
			if (!commentValue.replyTo) {
				orderedCommentIds.splice(0, 0, commentId);
				continue;
			}
			let i = orderedCommentIds.indexOf(commentValue.replyTo!) + 1;
			if (i != oldestToNewest.length - 1) {
				while (oldestToNewest[i][1].replyTo == commentValue.replyTo) {
					i++;
				}
			}
			orderedCommentIds.splice(i, 0, commentId);
		}
		return orderedCommentIds;
	}

	editComment(commentId: string): void {
		this.editsInProgress.push(commentId);
		this.startReply(commentId);
		this.repliesInProgress[commentId].setValue(this.comments[commentId].content);
	}

	startReply(commentId: string): void {
		if (!this.storageService.isLoggedIn()) {
			this.router.navigate(['/signin'], { queryParams: { returnUrl: this.router.url } });
		}
		if (commentId.startsWith("temp_")) {
			this.snackBar.open("Comment not fully loaded yet, please wait", "Close");
			return;
		}
		this.repliesInProgress[commentId] = new FormControl("", { nonNullable: true });
	}

	cancelReply(commentId: string): void {
		delete this.repliesInProgress[commentId];
		if (this.editsInProgress.includes(commentId)) {
			this.editsInProgress.splice(this.editsInProgress.indexOf(commentId), 1);
		}
	}

	submitReply(replyTo: string | 'post'): void {
		this.repliesInProgress[replyTo].setValue(this.repliesInProgress[replyTo].value.trim());
		if (this.repliesInProgress[replyTo].value.length == 0) {
			this.repliesInProgress[replyTo].setErrors({ required: true });
			return;
		} else if (this.repliesInProgress[replyTo].value.length > 5000) {
			this.repliesInProgress[replyTo].setErrors({ tooLong: true });
			return;
		}
		const tempCommentId = 'temp_' + new Date().toISOString();
		this.comments[tempCommentId] = {
			content: this.repliesInProgress[replyTo].value,
			depth: replyTo == 'post' ? 0 : this.comments[replyTo].depth + 1,
			owner: this.storageService.getUsername(),
			replyTo: replyTo == 'post' ? null : replyTo,
			voteCount: 0,
			isVotedByUser: false,
			createdOn: new Date()
		}
		this.commentCount.emit(this.getCommentCount());

		this.changeDetector.detectChanges();
		const element = document.getElementById('comment' + tempCommentId.toString()) as HTMLElement;
		if (element && element.offsetHeight < element.scrollHeight) {
			element.classList.add("long-comment");
		}

		this.commentService.create(this.repliesInProgress[replyTo].value, this.postId, replyTo == 'post' ? null : replyTo).subscribe({
			next: response => {
				const id = response.value;
				this.comments[id] = this.comments[tempCommentId];
				delete this.comments[tempCommentId];

				this.changeDetector.detectChanges();
				const element = document.getElementById('comment' + id) as HTMLElement;
				if (element && element.offsetHeight < element.scrollHeight) {
					element.classList.add("long-comment");
				}
			}
		});
		delete this.repliesInProgress[replyTo];
	}

	saveEditChanges(commentId: string) {
		this.repliesInProgress[commentId].setValue(this.repliesInProgress[commentId].value.trim());
		if (this.repliesInProgress[commentId].value.length == 0) {
			this.repliesInProgress[commentId].setErrors({ required: true });
			return;
		} else if (this.repliesInProgress[commentId].value.length > 5000) {
			this.repliesInProgress[commentId].setErrors({ tooLong: true });
			return;
		}

		this.commentService.edit(commentId, this.repliesInProgress[commentId].value);
		this.comments[commentId].content = this.repliesInProgress[commentId].value;
		delete this.repliesInProgress[commentId];
		this.editsInProgress.splice(this.editsInProgress.indexOf(commentId), 1);

		this.changeDetector.detectChanges();
		const element = document.getElementById('comment' + commentId.toString()) as HTMLElement;
		if (element && element.offsetHeight < element.scrollHeight) {
			element.classList.add("long-comment");
		}

	}

	voteOnComment(commentId: string) {
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

	isCommentedByCurrentUser(commentId: string) {
		return this.comments[commentId].owner.toLowerCase() == this.storageService.getUsername();
	}

	openDeleteCommentDialog(commentId: string) {
		this.dialog.open(DeleteDialogComponent, {
			data: {
				deleteAction: () => {
					this.commentService.delete(commentId);

					if (!Object.values(this.comments).some(c => c.replyTo == commentId)) {
						// eslint-disable-next-line no-constant-condition
						while (true) {
							const parentId: string | null = this.comments[commentId].replyTo;

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
