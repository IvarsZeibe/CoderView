import { Component, HostListener, OnInit } from '@angular/core';
import { PostSummary, PostsService } from '../_services/posts.service';
import { StorageService } from '../_services/storage.service';
import { Router } from '@angular/router';
import { getTimePassed } from '../_helpers/date-helper';

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

	constructor(private postsService: PostsService, private storageService: StorageService, private router: Router) { }

	ngOnInit(): void {
		this.filterPosts();
	}

	filterPosts(event: Event | null = null): void {
		if (event) {
			event.stopPropagation();
		}
		this.lastSearchFilter = this.titleSearchFilter;
		this.areAllPostsLoaded = false;
		this.timeStamp = null;
		this.postsService.getPosts(this.lastSearchFilter).subscribe(posts => {
			this.posts = posts;
			this.timeStamp = posts[posts.length - 1].createdOn;

		});
	}

	loadMorePosts(): void {
		this.isTryingToLoadPosts = true;
		this.postsService.getPosts(this.lastSearchFilter, this.timeStamp).subscribe(posts => {
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
			this.postsService.unvoteOnPost(post.id);
		} else {
			post.voteCount++;
			post.isVotedByUser = true;
			this.postsService.voteOnPost(post.id);
		}
	}

	getTimePassedString(fromDate: Date): string {
		const { timePassed, unit } = getTimePassed(fromDate, this.timeOnPageLoad);
		if (unit == "second") {
			return "Just now";
		}
		return `${timePassed.toString()} ${unit}${timePassed > 1 ? 's' : ''} ago`;
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
