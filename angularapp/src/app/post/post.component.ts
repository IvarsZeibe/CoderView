import { KeyValuePipe } from '@angular/common';
import { Component, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { StorageService } from '../_services/storage.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {
	@ViewChild('comment') comment: any;
	@ViewChild('test', { read: ViewContainerRef }) container: any;

	id: string | null = null;
	// key is -2 for new comment while the server hasn't returned the id of the newly created comment
	comments: Record<string | "-2", {
		owner: string,
		content: string,
		replyTo: string | null,
		depth: number
	}> = {};

	replies: Record<string, string> = {};
	constructor(private route: ActivatedRoute, private storageService: StorageService, private router: Router) { }

	ngOnInit(): void {
		this.id = this.route.snapshot.paramMap.get('id');
		this.comments = {
			"1": {
				content: "text",
				depth: 0,
				owner: "owner",
				replyTo: null
			},
			"2": {
				content: "text",
				depth: 0,
				owner: "owner",
				replyTo: null
			},
			"3": {
				content: "text",
				depth: 0,
				owner: "owner",
				replyTo: null
			},
			"4": {
				content: "text1",
				depth: 1,
				owner: "owner",
				replyTo: "2"
			},
			"5": {
				content: "text",
				depth: 0,
				owner: "owner",
				replyTo: null
			},
			"6": {
				content: "text2",
				depth: 1,
				owner: "owner",
				replyTo: "2"
			},
			"7": {
				content: "text",
				depth: 2,
				owner: "owner",
				replyTo: "4"
			}
		}
	}

	getOrderedCommentIds(): string[] {
		const orderedCommentIds: string[] = [];
		for (const commentId of Object.keys(this.comments)) {
			if (this.comments[commentId].replyTo) {
				const parentIndex = orderedCommentIds.indexOf(this.comments[commentId].replyTo!);
				orderedCommentIds.splice(parentIndex + 1, 0, commentId);
			}
			else if (commentId == "-2") {
				orderedCommentIds.splice(0, 0, commentId);
			} else {
				orderedCommentIds.push(commentId);
			}
		}
		return orderedCommentIds;
	}

	createComment(): void {
		this.replies["-1"] = "";
	}

	startReply(commentId: string): void {
		if (!this.storageService.isLoggedIn()) {
			this.router.navigate(['/signin']);
		}
		this.replies[commentId] = "";
	}

	cancelReply(commentId: string): void {
		delete this.replies[commentId];
	}

	submitReply(replyTo: string | "-1"): void {
		this.comments["-2"] = {
			content: this.replies[replyTo],
			depth: replyTo == "-1" ? 0 : this.comments[replyTo].depth + 1,
			owner: "user",
			replyTo: replyTo == "-1" ? null : replyTo
		}
		delete this.replies[replyTo];
	}
}
