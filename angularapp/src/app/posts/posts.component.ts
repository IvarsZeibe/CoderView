import { Component, HostListener, OnInit } from '@angular/core';
import { PostSummary, PostService } from '../_services/post.service';
import { StorageService } from '../_services/storage.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DateHelperService } from '../_services/date-helper.service';
import { FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
	selector: 'app-posts',
	templateUrl: './posts.component.html',
	styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit {
	posts: PostSummary[] = [];
	titleSearchFilter = "";
	lastSearchFilter = "";
	timeStamp: Date | null = null;
	isTryingToLoadPosts = false;
	areAllPostsLoaded = false;

	timeOnPageLoad = new Date();

	postTypes = [
		{ value: "discussion", viewValue: "Discussions" },
		{ value: "snippet", viewValue: "Code snippets" }
	];
	postTypeFormControl: FormControl<"discussion" | "snippet"> = new FormControl("discussion", { nonNullable: true });

	constructor(
		private route: ActivatedRoute,
		private postService: PostService,
		private storageService: StorageService,
		private router: Router,
		public dateHelperService: DateHelperService,
		private snackBar: MatSnackBar
	) { }

	ngOnInit(): void {
		const postType = this.route.snapshot.queryParamMap.get('type');
		if (postType == "snippet") {
			this.postTypeFormControl.setValue(postType);
		} else if (postType == "discussion") {
			this.postTypeFormControl.setValue(postType);
		} else if (postType) {
			this.router.navigate(['/posts']);
		}

		this.postTypeFormControl.valueChanges.subscribe(change => {
			this.posts = [];
			this.filterPosts();
		});

		this.filterPosts();
	}

	getPostTypeTitle() {
		for (const type of this.postTypes) {
			if (type.value == this.postTypeFormControl.value) {
				return type.viewValue;
			}
		}
		return "Unkown post type";
	}

	filterPosts(event: Event | null = null): void {
		if (event) {
			event.stopPropagation();
		}
		this.lastSearchFilter = this.titleSearchFilter;
		this.areAllPostsLoaded = false;
		this.timeStamp = null;
		this.isTryingToLoadPosts = true;
		this.postService.getAll(this.postTypeFormControl.value, this.lastSearchFilter).subscribe(posts => {
			this.posts = posts;
			this.timeStamp = posts[posts.length - 1].createdOn;
			this.isTryingToLoadPosts = false;
		});
	}

	loadMorePosts(): void {
		this.isTryingToLoadPosts = true;
		this.postService.getAll(this.postTypeFormControl.value, this.lastSearchFilter, this.timeStamp).subscribe(posts => {
			if (posts.length == 0) {
				this.areAllPostsLoaded = true;
			}
			this.posts = this.posts.concat(posts);
			this.timeStamp = this.posts[this.posts.length - 1].createdOn;
			this.isTryingToLoadPosts = false;
		});
	}

	async voteOnPost(event: Event, post: PostSummary): Promise<void> {
		event.stopPropagation();
		if (!this.storageService.isLoggedIn()) {
			this.router.navigate(['/signin']);
		}
		if (post.isVotedByUser) {
			post.voteCount--;
			post.isVotedByUser = false;
			this.postService.unvoteOn(post.id);
		} else {
			post.voteCount++;
			post.isVotedByUser = true;
			this.postService.voteOn(post.id);
		}
	}

	openCopySnackBar() {
		this.snackBar.open("Saved to clipboard", "Close");
	}

	@HostListener("window:scroll", ["$event"])
	onWindowScroll() {
		//In chrome and some browser scroll is given to body tag
		const position = (document.documentElement.scrollTop || document.body.scrollTop) + document.documentElement.offsetHeight;
		const max = document.documentElement.scrollHeight;
		if (max - position < 100) {
			if (!this.isTryingToLoadPosts && !this.areAllPostsLoaded) {
				this.loadMorePosts();
			}
		}
	}
}
