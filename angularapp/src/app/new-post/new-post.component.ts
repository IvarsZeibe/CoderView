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
	titleFormControl = new FormControl("", { nonNullable: true, validators: [Validators.required] });
	contentFormControl = new FormControl("", { nonNullable: true, validators: [Validators.required] });

	constructor(private postsService: PostsService, private router: Router) { }

	createNewPost(): void {
		this.titleFormControl.setValue(this.titleFormControl.value.trim());
		if (this.titleFormControl.value.length == 0) {
			this.titleFormControl.setErrors({ "required": true });
		} else if (this.titleFormControl.value.length < 5 || this.titleFormControl.value.length > 150) {
			this.titleFormControl.setErrors({ "invalidLength": true });
		}

		this.contentFormControl.setValue(this.contentFormControl.value.trim());
		if (this.contentFormControl.value.length == 0) {
			this.contentFormControl.setErrors({ "required": true });
		} else if (this.contentFormControl.value.length < 5 || this.contentFormControl.value.length > 40000) {
			this.contentFormControl.setErrors({ "invalidLength": true });
		}

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
