import { Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { PostService, PostType } from '../_services/post.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, Validators } from '@angular/forms';
import { Observable, map, startWith } from 'rxjs';
import { MatChipEditedEvent, MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { PostContent, PostContentService } from '../_services/post-content.service';
import { MatDialog } from '@angular/material/dialog';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';
import { MatSelectChange } from '@angular/material/select';
import { ProgrammingLanguagesService } from '../_services/programming-languages.service';

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

	postTypeFormControl: FormControl<PostType> = new FormControl("discussion", { nonNullable: true });

	availableTagOptions: Observable<string[]> = new Observable();
	allTagOptions: string[] = [];
	appliedTags: string[] = [];

	@ViewChild(MatAutocompleteTrigger) autocomplete?: MatAutocompleteTrigger;
	@ViewChild('tagInput', { static: false }) tagInput?: ElementRef<HTMLInputElement>;

	editorOptions = { theme: 'vs-dark', language: 'javascript', automaticLayout: true };

	selectedProgrammingLanguage = 'javascript';

	constructor(
		public postService: PostService,
		private router: Router,
		private route: ActivatedRoute,
		private postContentService: PostContentService,
		private dialog: MatDialog,
		public programmingLanguagesService: ProgrammingLanguagesService
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
			const postTypeParam = this.route.snapshot.queryParamMap.get('type');
			const postType = this.postService.postTypes.find(p =>
				p.value == postTypeParam
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
			this.allTagOptions = tags;
			this.availableTagOptions = this.tagFormControl.valueChanges.pipe(
				startWith(''),
				map(value => this._filter(value || '')),
			);
		});
	}

	ngOnDestroy() {
		this.postContentService.clear();
	}

	setContent(postContent: PostContent) {
		this.titleFormControl.setValue(postContent.title);
		this.contentFormControl.setValue(postContent.content);
		this.appliedTags = postContent.tags;
		this.postTypeFormControl.setValue(postContent.postType);
		if (postContent.programmingLanguage) {
			this.editorOptions = {
				language: postContent.programmingLanguage,
				theme: this.editorOptions.theme,
				automaticLayout: this.editorOptions.automaticLayout
			};
			this.selectedProgrammingLanguage = postContent.programmingLanguage;
		}
	}

	createNewPost(): void {
		this.titleFormControl.setValue(this.titleFormControl.value.trim());
		this.contentFormControl.setValue(this.contentFormControl.value.trim());
		this.titleFormControl.markAsTouched();
		this.contentFormControl.markAsTouched();

		if (this.contentFormControl.invalid || this.titleFormControl.invalid) {
			return;
		}	

		const programmingLanguage = this.postTypeFormControl.value == "snippet" ? this.editorOptions.language : null;

		this.postService.createNew(
			this.postTypeFormControl.value,
			this.titleFormControl.value,
			this.contentFormControl.value,
			this.appliedTags,
			programmingLanguage
		).subscribe({
			next: response => {
				this.router.navigate(['/post/' + response.value]);
			}
		});
	}

	private _filter(value: string): string[] {
		const filterValue = value.toLowerCase();

		return this.allTagOptions.filter(tag => tag.toLowerCase().includes(filterValue) && !this.appliedTags.includes(tag));
	}

	addTag(event: MatChipInputEvent): void {
		const value = (event.value || '').trim();
		if (this.tagFormControl.invalid) {
			this.chipFormControl.markAsTouched();
			this.chipFormControl.setErrors({});
			return;
		}

		if (value) {
			if (this.appliedTags.every(t => t != value)) {
				this.appliedTags.push(value);
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
		const index = this.appliedTags.indexOf(tag);

		if (index >= 0) {
			this.appliedTags.splice(index, 1);
		}
		this.tagFormControl.updateValueAndValidity();
	}

	editTag(tag: string, event: MatChipEditedEvent) {
		const value = event.value.trim();

		if (!value) {
			this.removeTag(tag);
			return;
		}

		const index = this.appliedTags.indexOf(tag);
		if (index >= 0) {
			this.appliedTags[index] = value;
		}
		this.tagFormControl.updateValueAndValidity();
	}

	tagSelected(event: MatAutocompleteSelectedEvent): void {
		this.appliedTags.push(event.option.viewValue);
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
			const programmingLanguage = this.postTypeFormControl.value == "snippet" ? this.editorOptions.language : null;
			this.postService.savePostChanges(
				this.postId,
				this.titleFormControl.value,
				this.contentFormControl.value,
				this.appliedTags,
				programmingLanguage
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

	selectLanguage(event: MatSelectChange) {
		this.editorOptions = {
			language: event.value,
			theme: this.editorOptions.theme,
			automaticLayout: this.editorOptions.automaticLayout
		};
	}
}
