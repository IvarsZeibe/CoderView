import { Component, OnInit } from '@angular/core';
import { PostSummary, PostsService } from '../_services/posts.service';

@Component({
	selector: 'app-posts',
	templateUrl: './posts.component.html',
	styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit {
	posts: PostSummary[] = [];

	constructor(private postsService: PostsService) { }

	ngOnInit(): void {
		this.postsService.getAllPosts().subscribe(posts => this.posts = posts);
	}
}
