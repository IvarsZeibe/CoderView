import { Component } from '@angular/core';
import { PostsService } from '../_services/posts.service';
import { Router } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-new-post',
  templateUrl: './new-post.component.html',
  styleUrls: ['./new-post.component.css']
})
export class NewPostComponent {
	titleFormControl = new FormControl("", {
		nonNullable: true,
		validators: [Validators.required, Validators.minLength(5), Validators.maxLength(150)]
	});
	contentFormControl = new FormControl("", {
		nonNullable: true,
		validators: [Validators.required, Validators.minLength(5), Validators.maxLength(40000)]
	});

	constructor(private postsService: PostsService, private router: Router) { }

	createNewPost(): void {
		this.titleFormControl.setValue(this.titleFormControl.value.trim());
		this.contentFormControl.setValue(this.contentFormControl.value.trim());

		if (this.contentFormControl.invalid || this.titleFormControl.invalid) {
			return;
		}	

		this.postsService.createNewPost(this.titleFormControl.value, this.contentFormControl.value).subscribe({
			next: response => {
				this.router.navigate(['/post/' + response.value]);
			}
		});
	}
}
