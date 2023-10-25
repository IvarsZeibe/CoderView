import { AfterViewInit, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { PostSummary, PostService } from '../_services/post.service';
import { StorageService } from '../_services/storage.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DateHelperService } from '../_services/date-helper.service';
import { FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatExpansionPanel } from '@angular/material/expansion';
import { Observable, map, startWith } from 'rxjs';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent, MatAutocompleteTrigger } from '@angular/material/autocomplete';

type PostType = PostsComponent['postTypes'][number]['value'];

@Component({
	selector: 'app-posts',
	templateUrl: './posts.component.html',
	styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit, AfterViewInit {
	posts: PostSummary[] = [];
	titleSearchFilter = "";
	appliedSearchFilter = "";
	timeStamp: Date | null = null;
	isTryingToLoadPosts = false;
	areAllPostsLoaded = false;

	timeOnPageLoad = new Date();

	postTypes = [
		{ value: "discussion", viewValue: "Discussions" },
		{ value: "snippet", viewValue: "Code snippets" }
	] as const;
	postTypeFormControl: FormControl<PostType> = new FormControl("discussion", { nonNullable: true });
	tagFormControl = new FormControl();
	chipFormControl = new FormControl();

	@ViewChild('searchPanel') searchPanel: MatExpansionPanel | undefined;
	@ViewChild(MatAutocompleteTrigger) autocomplete: MatAutocompleteTrigger | null = null;
	@ViewChild('tagInput', { static: false }) tagInput: ElementRef<HTMLInputElement> | null = null;
	tagOptions: string[] = [];
	filteredTagOptions: Observable<string[]> = new Observable()
	appliedTagFilters: string[] = [];

	constructor(
		private route: ActivatedRoute,
		private postService: PostService,
		private storageService: StorageService,
		private router: Router,
		public dateHelperService: DateHelperService,
		private snackBar: MatSnackBar
	) { }

	ngOnInit(): void {
		this.route.queryParamMap.subscribe(queryParamMap => {
			const postTypeParam = queryParamMap.get('type');
			const postType = this.postTypes.find(p =>
				p.value == postTypeParam
			)?.value;
			if (postType) {
				this.postTypeFormControl.setValue(postType);
			} else {
				this.postTypeFormControl.setValue('discussion');
				this.router.navigate([]);
			}
		})

		const filterByTag = this.route.snapshot.queryParamMap.get('tag');
		if (filterByTag) {
			this.appliedTagFilters.push(filterByTag);
			this.searchPanel?.toggle();
		}

		this.postTypeFormControl.valueChanges.subscribe(postType => {
			this.router.navigate([], { queryParams: { type: postType } });
			this.posts = [];
			this.filterPosts();
		});

		this.filterPosts();

		this.postService.getAllTags().subscribe(tags => {
			this.tagOptions = tags;
			this.filteredTagOptions = this.tagFormControl.valueChanges.pipe(
				startWith(''),
				map(value => this._filterTags(value || '')),
			);
		});
	}

	ngAfterViewInit() {
		const filterByTag = this.route.snapshot.queryParamMap.get('tag');
		if (filterByTag) {
			this.searchPanel?.toggle();
			this.router.navigate([], {
				queryParams: { tag: null },
				queryParamsHandling: 'merge'
			});
		}
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
		this.posts = [];
		this.appliedSearchFilter = this.titleSearchFilter;
		this.areAllPostsLoaded = false;
		this.timeStamp = null;
		this.isTryingToLoadPosts = true;
		this.postService.getAll(this.postTypeFormControl.value, this.appliedSearchFilter, this.appliedTagFilters).subscribe(posts => {
			this.posts = posts;
			if (posts.length > 0) {
				this.timeStamp = posts[posts.length - 1].createdOn;
			}
			this.isTryingToLoadPosts = false;
		});
	}

	loadMorePosts(): void {
		this.isTryingToLoadPosts = true;
		this.postService.getAll(this.postTypeFormControl.value, this.appliedSearchFilter, this.appliedTagFilters, this.timeStamp).subscribe(posts => {
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
			this.router.navigate(['/signin'], { queryParams: { returnUrl: this.router.url } });
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

	getFormattedAuthor(author: string) {
		if (this.storageService.getUsername() == author) {
			author += ' (You)';
		}
		return author;
	}

	handleSearch(event: KeyboardEvent) {
		if (event.code == 'Space') {
			event.stopPropagation();
		} else if (event.code == "Enter") {
			this.filterPosts(event);
		}
	}

	public toggleAdvancedSearch() {
		this.searchPanel?.toggle();
		if (this.autocomplete) {
			this.autocomplete.closePanel();
		}
	}

	private _filterTags(value: string): string[] {
		const filterValue = value.toLowerCase();

		return this.tagOptions.filter(tag => tag.toLowerCase().includes(filterValue) && !this.appliedTagFilters.includes(tag));
	}

	addTagFilter(event: MatChipInputEvent): void {
		let value: string | undefined = (event.value || '').trim();
		value = this.tagOptions.find(t => t.toLowerCase() == value?.toLowerCase());
		if (!value) {
			this.chipFormControl.markAsTouched();
			this.chipFormControl.setErrors({});
			return;
		}

		if (value) {
			if (this.appliedTagFilters.every(t => t != value)) {
				this.appliedTagFilters.push(value);
			}
		}

		if (this.autocomplete) {
			this.autocomplete.closePanel();
		}

		this.tagFormControl.reset();
		this.chipFormControl.reset();
		event.chipInput!.clear();
		this.filterPosts();
	}

	removeTagFilter(tag: string): void {
		const index = this.appliedTagFilters.indexOf(tag);

		if (index >= 0) {
			this.appliedTagFilters.splice(index, 1);
		}
		this.tagFormControl.updateValueAndValidity();
		this.filterPosts();
	}

	tagSelected(event: MatAutocompleteSelectedEvent): void {
		this.appliedTagFilters.push(event.option.viewValue);
		if (this.tagInput) {
			this.tagInput.nativeElement.value = ''
		}
		this.tagFormControl.reset();
		this.filterPosts();
	}

	getCollapsedHeight() {
		return window.screen.width > 600 ? '50px' : '120px';
	}

	getExpandedHeight() {
		return window.screen.width > 600 ? '70px' : '140px';
	}

	filterByTag(tag: string) {
		this.appliedTagFilters = [tag];
		this.filterPosts();
		if (!this.searchPanel?.expanded) {
			this.toggleAdvancedSearch();
		}
	}
}
