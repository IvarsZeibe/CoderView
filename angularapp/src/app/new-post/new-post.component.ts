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
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { GuideContent } from '../_services/guide-formatting.service';

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
	descriptionFormControl = new FormControl("", {
		nonNullable: true,
		validators: [Validators.required, Validators.minLength(5), Validators.maxLength(1000)]
	});
	contentFormControl = new FormControl("", {
		nonNullable: true,
		validators: [Validators.required, Validators.minLength(5), Validators.maxLength(20000)]
	});
	tagFormControl = new FormControl("", {
		nonNullable: true,
		validators: [Validators.required, Validators.maxLength(30), Validators.pattern("^[a-zA-Z0-9_ ]*$")]
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

	editedSectionIndex?: number;
	sections: {
		title: string,
		content: string,
		titleFormControl: FormControl<string>,
		contentFormControl: FormControl<string>
	}[] = [];

	errors = "";

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

			this.addNewSection();
		}

		this.postTypeFormControl.valueChanges.subscribe(postType => {
			this.titleFormControl.updateValueAndValidity();
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
		this.appliedTags = postContent.tags;
		this.postTypeFormControl.setValue(postContent.postType);
		if (postContent.postType != 'guide') {
			this.contentFormControl.setValue(postContent.content);
		} else {
			const guideSections: GuideContent = JSON.parse(postContent.content)
			for (const s of guideSections) {
				this.sections.push(
					{
						...s,
						titleFormControl: new FormControl(s.title, {
							nonNullable: true,
							validators: [Validators.required, Validators.maxLength(150)]
						}),
						contentFormControl: new FormControl(s.content, {
							nonNullable: true,
							validators: [Validators.required, Validators.maxLength(100000)]
						})
					}
				);
			}
		}
		if (postContent.programmingLanguage) {
			this.editorOptions = {
				language: postContent.programmingLanguage,
				theme: this.editorOptions.theme,
				automaticLayout: this.editorOptions.automaticLayout
			};
			this.selectedProgrammingLanguage = postContent.programmingLanguage;
		}

		if (postContent.description) {
			this.descriptionFormControl.setValue(postContent.description);
		}
	}

	savePost(): void {
		this.titleFormControl.setValue(this.titleFormControl.value.trim());
		this.contentFormControl.setValue(this.contentFormControl.value.trim());
		this.descriptionFormControl.setValue(this.descriptionFormControl.value.trim());
		this.titleFormControl.markAsTouched();
		this.contentFormControl.markAsTouched();
		this.descriptionFormControl.markAsTouched();

		if (this.titleFormControl.invalid ||
			(this.contentFormControl.invalid && this.postTypeFormControl.value != "guide") ||
			(this.descriptionFormControl.invalid && this.postTypeFormControl.value == "guide")) {
			return;
		}

		if (this.postTypeFormControl.value == "guide") {
			if (this.editedSectionIndex !== undefined) {
				this.titleFormControl.setErrors({ edittingSection: true });
			} else if (this.sections.length == 0) {
				this.titleFormControl.setErrors({ noSections: true });
			}
			if (this.titleFormControl.invalid) {
				return;
			}
			const sections = this.sections.map((s => { return { title: s.title, content: s.content } }));
			this.contentFormControl.setValue(JSON.stringify(sections));
		}

		const programmingLanguage = this.postTypeFormControl.value == "snippet" ? this.editorOptions.language : undefined;
		const description = this.postTypeFormControl.value == "guide" ? this.descriptionFormControl.value : undefined;

		if (this.isModifyingExistingPost) {
			if (!this.postId) {
				return;
			}
			this.postService.savePostChanges(
				this.postId,
				this.titleFormControl.value,
				this.contentFormControl.value,
				this.appliedTags,
				programmingLanguage,
				description
			).subscribe({
				complete: () => {
					this.router.navigate(['/post/' + this.postId]);
				}
			});
		} else {
			this.postService.createNew(
				this.postTypeFormControl.value,
				this.titleFormControl.value,
				this.contentFormControl.value,
				this.appliedTags,
				programmingLanguage,
				description
			).subscribe({
				next: response => {
					this.router.navigate(['/post/' + response.value]);
				}
			});
		}
	}

	private _filter(value: string): string[] {
		const filterValue = value.toLowerCase();

		return this.allTagOptions.filter(tag => tag.toLowerCase().includes(filterValue) && !this.appliedTags.includes(tag));
	}

	addTag(event: MatChipInputEvent): void {
		const value = (event.value || '').trim();
		if (this.tagFormControl.invalid) {
			this.chipFormControl.markAsTouched();
			this.chipFormControl.setErrors({ invalidTag: true});
			return;
		}

		if (this.validateMaxTagCount()) {
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

	tagSelected(event: MatAutocompleteSelectedEvent): void {
		if (this.validateMaxTagCount()) {
			return;
		}

		this.appliedTags.push(event.option.viewValue);
		if (this.tagInput) {
			this.tagInput.nativeElement.value = ''
		}
		this.tagFormControl.reset();
	}

	validateMaxTagCount(): boolean {
		if (this.appliedTags.length >= 20) {
			this.chipFormControl.markAsTouched();
			this.chipFormControl.setErrors({ isMaxCountReached: true });
			return true;
		}
		return false
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

		this.tagFormControl.setValue(value);
		this.tagFormControl.updateValueAndValidity();
		if (this.tagFormControl.invalid) {
			this.chipFormControl.markAsTouched();
			this.chipFormControl.setErrors({ invalidTag: true });
			return;
		}		

		const index = this.appliedTags.indexOf(tag);
		if (index >= 0) {
			this.appliedTags[index] = value;
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

	drop(event: CdkDragDrop<string[]>) {
		moveItemInArray(this.sections, event.previousIndex, event.currentIndex);
		if (this.editedSectionIndex !== undefined) {
			if (event.previousIndex < this.editedSectionIndex && event.currentIndex >= this.editedSectionIndex) {
				this.editedSectionIndex--;
			} else if (event.previousIndex > this.editedSectionIndex && event.currentIndex <= this.editedSectionIndex) {
				this.editedSectionIndex++;
			} else if (event.previousIndex == this.editedSectionIndex) {
				this.editedSectionIndex = event.currentIndex;
			}
		}
	}

	addNewSection() {
		if (!this.isCurrentlyEditedSectionValid()) {
			return;
		}
		this.editedSectionIndex = this.sections.length;
		this.sections.push({
			title: "",
			content: "",
			titleFormControl: new FormControl("", {
				nonNullable: true,
				validators: [Validators.required, Validators.maxLength(150)]
			}),
			contentFormControl: new FormControl("", {
				nonNullable: true,
				validators: [Validators.required, Validators.maxLength(100000)]
			})
		});
		this.titleFormControl.updateValueAndValidity();
	}

	isCurrentlyEditedSectionValid(): boolean {
		if (this.editedSectionIndex !== undefined) {
			const editedSection = this.sections[this.editedSectionIndex]
			editedSection.titleFormControl.markAsTouched();
			editedSection.titleFormControl.updateValueAndValidity();
			editedSection.contentFormControl.markAsTouched();
			editedSection.contentFormControl.updateValueAndValidity();
			if (editedSection.titleFormControl.invalid || editedSection.contentFormControl.invalid) {
				return false;
			}
		}
		return true;
	}

	editSection(index: number) {
		if (!this.isCurrentlyEditedSectionValid()) {
			return;
		}
		this.editedSectionIndex = index;
	}

	cancelSectionEditing() {
		if (this.editedSectionIndex === undefined) {
			return;
		}

		const editedSection = this.sections[this.editedSectionIndex]
		if (editedSection.title == "") {
			this.sections.splice(this.editedSectionIndex, 1);
		} else {
			editedSection.titleFormControl.setValue(editedSection.title);
			editedSection.contentFormControl.setValue(editedSection.content);
		}
		this.editedSectionIndex = undefined;
		this.titleFormControl.updateValueAndValidity();
	}

	saveSectionEditing() {
		if (this.editedSectionIndex === undefined || !this.isCurrentlyEditedSectionValid()) {
			return;
		}
		const editedSection = this.sections[this.editedSectionIndex]
		editedSection.title = editedSection.titleFormControl.value;
		editedSection.content = editedSection.contentFormControl.value;
		this.editedSectionIndex = undefined;
		this.titleFormControl.updateValueAndValidity();
	}
	openDeleteSectionDialog(index: number) {
		this.dialog.open(DeleteDialogComponent, {
			data: {
				deleteAction: () => {
					if (this.editedSectionIndex !== undefined) {
						if (index < this.editedSectionIndex) {
							this.editedSectionIndex--;
						}
					}
					this.sections.splice(index, 1);
				},
				itemToDelete: 'section'
			}
		});
	}
}
