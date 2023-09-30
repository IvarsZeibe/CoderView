import { Component, OnInit } from '@angular/core';
import { PostSummary, PostsService } from '../_services/posts.service';
import { StorageService } from '../_services/storage.service';
import { Router } from '@angular/router';

@Component({
	selector: 'app-posts',
	templateUrl: './posts.component.html',
	styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit {
	posts: PostSummary[] = [];

	constructor(private postsService: PostsService, private storageService: StorageService, private router: Router) { }

	ngOnInit(): void {
		this.postsService.getAllPosts().subscribe(posts => this.posts = posts);
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
}
