import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { PostService } from '../_services/post.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import { Observable, map, startWith } from 'rxjs';
import { MatChipEditedEvent, MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { PostContent, PostContentService } from '../_services/post-content.service';
import { MatDialog } from '@angular/material/dialog';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';

type PostType = NewPostComponent['postTypes'][number]['value'];

@Component({
  selector: 'app-new-post',
  templateUrl: './new-post.component.html',
  styleUrls: ['./new-post.component.css']
})
export class NewPostComponent implements OnInit, OnDestroy {
	isModifyingExistingPost = false;
	postId: string | null = null;

	titleFormControl = new FormControl("", {
		nonNullable: true,
		validators: [Validators.required, Validators.minLength(5), Validators.maxLength(150)]
	});
	contentFormControl = new FormControl("", {
		nonNullable: true,
		validators: [Validators.required, Validators.minLength(5), Validators.maxLength(40000)]
	});
	tagFormControl = new FormControl("", {
		nonNullable: true,
		validators: [Validators.required, Validators.maxLength(30)]
	});
	chipFormControl = new FormControl("");

	postTypes = [
		{ value: "discussion", viewValue: "Discussions" },
		{ value: "snippet", viewValue: "Code snippets" }
	] as const;

	postTypeFormControl: FormControl<PostType> = new FormControl("discussion", { nonNullable: true });

	filteredOptions: Observable<string[]> = new Observable();
	tagOptions: string[] = [];
	tags: string[] = [];

	@ViewChild(MatAutocompleteTrigger) autocomplete: MatAutocompleteTrigger | null = null;
	@ViewChild('tagInput', { static: false }) tagInput: ElementRef<HTMLInputElement> | null = null;

	constructor(
		private postService: PostService,
		private router: Router,
		private route: ActivatedRoute,
		private postContentService: PostContentService,
		private dialog: MatDialog,
	) { }

	ngOnInit() {
		const postId = this.route.snapshot.paramMap.get('id');
		if (postId) {
			this.postId = postId;
			this.isModifyingExistingPost = true;
			this.postTypeFormControl.disable();
			const postData = this.postContentService.getPostContent();
			if (postData) {
				this.setContent(postData)
			} else {
				this.postService.getPostContent(postId).subscribe({
					next: data => this.setContent(data),
					error: () => this.router.navigate(['/posts'])
				});
			}
		} else {
			const postType = this.postTypes.find(p =>
				p.value === this.route.snapshot.queryParamMap.get('type')
			)?.value;
			if (postType) {
				this.postTypeFormControl.setValue(postType);
			} else {
				this.router.navigate([]);
			}
		}

		this.postTypeFormControl.valueChanges.subscribe(postType => {
			this.router.navigate([], { queryParams: { type: postType } });
		});

		this.postService.getAllTags().subscribe(tags => {
			this.tagOptions = tags;
		});
		this.filteredOptions = this.tagFormControl.valueChanges.pipe(
			startWith(''),
			map(value => this._filter(value || '')),
		);
	}

	ngOnDestroy() {
		this.postContentService.clear();
	}

	setContent(postContent: PostContent) {
		this.titleFormControl.setValue(postContent.title);
		this.contentFormControl.setValue(postContent.content);
		this.tags = postContent.tags;
		this.postTypeFormControl.setValue(postContent.postType);
	}

	createNewPost(): void {
		this.titleFormControl.setValue(this.titleFormControl.value.trim());
		this.contentFormControl.setValue(this.contentFormControl.value.trim());

		if (this.contentFormControl.invalid || this.titleFormControl.invalid) {
			return;
		}	

		this.postService.createNew(
			this.postTypeFormControl.value,
			this.titleFormControl.value,
			this.contentFormControl.value,
			this.tags
		).subscribe({
			next: response => {
				this.router.navigate(['/post/' + response.value]);
			}
		});
	}

	private _filter(value: string): string[] {
		const filterValue = value.toLowerCase();

		return this.tagOptions.filter(tag => tag.toLowerCase().includes(filterValue) && !this.tags.includes(tag));
	}

	addTag(event: MatChipInputEvent): void {
		const value = (event.value || '').trim();
		if (this.tagFormControl.invalid) {
			this.chipFormControl.markAsTouched();
			this.chipFormControl.setErrors({});
			return;
		}

		if (value) {
			if (this.tags.every(t => t != value)) {
				this.tags.push(value);
			}
		}
		
		if (this.autocomplete) {
			this.autocomplete.closePanel();
		}

		this.tagFormControl.reset();
		this.chipFormControl.reset();
		event.chipInput!.clear();
	}

	removeTag(tag: string): void {
		const index = this.tags.indexOf(tag);

		if (index >= 0) {
			this.tags.splice(index, 1);
		}
		this.tagFormControl.updateValueAndValidity();
	}

	editTag(tag: string, event: MatChipEditedEvent) {
		const value = event.value.trim();

		if (!value) {
			this.removeTag(tag);
			return;
		}

		const index = this.tags.indexOf(tag);
		if (index >= 0) {
			this.tags[index] = value;
		}
		this.tagFormControl.updateValueAndValidity();
	}

	tagSelected(event: MatAutocompleteSelectedEvent): void {
		this.tags.push(event.option.viewValue);
		if (this.tagInput) {
			this.tagInput.nativeElement.value = ''
		}		
		this.tagFormControl.reset();
	}

	saveChanges() {
		this.titleFormControl.setValue(this.titleFormControl.value.trim());
		this.contentFormControl.setValue(this.contentFormControl.value.trim());

		if (this.contentFormControl.invalid || this.titleFormControl.invalid) {
			return;
		}
		if (this.postId) {
			this.postService.savePostChanges(
				this.postId,
				this.titleFormControl.value,
				this.contentFormControl.value,
				this.tags
			).subscribe({
				next: response => {
					this.router.navigate(['/post/' + this.postId]);
				}
			});
		}
	}

	openDeletePostDialog() {
		this.dialog.open(DeleteDialogComponent, {
			data: {
				deleteAction: () => {
					if (this.postId) {
						this.postService.delete(this.postId).subscribe({
							next: () => this.router.navigate(['/posts']),
							error: (e) => console.log(e)
						});
					}
				},
				itemToDelete: 'post'
			}
		});
	}
}
