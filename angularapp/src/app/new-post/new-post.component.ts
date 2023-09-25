import { Component } from '@angular/core';
import { PostsService } from '../_services/posts.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-new-post',
  templateUrl: './new-post.component.html',
  styleUrls: ['./new-post.component.css']
})
export class NewPostComponent {
	title = "";
	content = "";

	constructor(private postsService: PostsService, private router: Router) { }

	createNewPost(): void {
		this.postsService.createNewPost(this.title, this.content).subscribe({
			next: postId => {
				console.log("test");
				this.router.navigate(['/post/' + postId]);
			}
		});
	}
}
