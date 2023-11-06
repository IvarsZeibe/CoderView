import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostListener, OnInit, ViewChild } from '@angular/core';
import { PostSummary, PostService, PostType } from '../_services/post.service';
import { StorageService } from '../_services/storage.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DateHelperService } from '../_services/date-helper.service';
import { FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatExpansionPanel } from '@angular/material/expansion';
import { Observable, Subscription, finalize, map, startWith } from 'rxjs';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent, MatAutocompleteTrigger } from '@angular/material/autocomplete';
import { ProgrammingLanguagesService } from '../_services/programming-languages.service';

@Component({
	selector: 'app-posts',
	templateUrl: './posts.component.html',
	styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit, AfterViewInit {
	posts: PostSummary[] = [];

	unappliedTitleFilter = "";
	appliedTitleFilter = "";
	timeStamp?: Date;
	postTypeFormControl: FormControl<PostType> = new FormControl("discussion", { nonNullable: true });
	tagFormControl = new FormControl();
	programmingLanguageFilter?: string;
	appliedTagFilters: string[] = [];

	isTryingToLoadPosts = false;
	areAllPostsLoaded = false;

	timeOnPageLoad = new Date();

	@ViewChild('searchPanel') searchPanel?: MatExpansionPanel;
	@ViewChild(MatAutocompleteTrigger) tagAutocomplete?: MatAutocompleteTrigger;
	@ViewChild('tagInput', { static: false }) tagInput?: ElementRef<HTMLInputElement>;

	allTagOptions: string[] = [];
	availableTagOptions: Observable<string[]> = new Observable()

	getPostsRequest?: Subscription;

	constructor(
		private route: ActivatedRoute,
		public postService: PostService,
		private storageService: StorageService,
		private router: Router,
		public dateHelperService: DateHelperService,
		private snackBar: MatSnackBar,
		public programmingLanguagesService: ProgrammingLanguagesService,
		private changeDetector: ChangeDetectorRef
	) { }

	ngOnInit(): void {
		this.route.queryParamMap.subscribe(queryParamMap => {
			const postTypeParam = queryParamMap.get('type');
			const postType = this.postService.postTypes.find(p =>
				p.value == postTypeParam
			)?.value;
			if (postType) {
				this.postTypeFormControl.setValue(postType);
			} else {
				this.postTypeFormControl.setValue('discussion');
				this.router.navigate([]);
			}
			this.filterPosts();
		})

		const filterByTag = this.route.snapshot.queryParamMap.get('tag');
		if (filterByTag) {
			this.appliedTagFilters.push(filterByTag);
		}

		this.postTypeFormControl.valueChanges.subscribe(postType => {
			this.router.navigate([], { queryParams: { type: postType } });
		});

		this.postService.getAllTags().subscribe(tags => {
			this.allTagOptions = tags;
			this.availableTagOptions = this.tagFormControl.valueChanges.pipe(
				startWith(''),
				map(value => this._filterTags(value || '')),
			);
		});

		new ResizeObserver(() => {
			if (this.isNearPageBottom()) {
				this.loadMorePosts();
			}
		}).observe(document.documentElement);
	}

	ngAfterViewInit() {
		const filterByTag = this.route.snapshot.queryParamMap.get('tag');
		if (filterByTag) {
			this.searchPanel?.open();
			this.router.navigate([], {
				queryParams: { tag: null },
				queryParamsHandling: 'merge'
			});
		}
	}

	getPostTypeTitle() {
		for (const type of this.postService.postTypes) {
			if (type.value == this.postTypeFormControl.value) {
				return type.viewValue;
			}
		}
		return "Unkown post type";
	}

	filterPosts(): void {
		this.getPostsRequest?.unsubscribe();

		this.posts = [];
		this.areAllPostsLoaded = false;
		this.isTryingToLoadPosts = true;
		this.timeStamp = undefined;

		this.getPostsRequest = this.postService
			.getAll({
				postType: this.postTypeFormControl.value,
				title: this.appliedTitleFilter,
				programmingLanguage: this.postTypeFormControl.value == "snippet" ? this.programmingLanguageFilter : undefined,
				tags: this.appliedTagFilters

			})
			.subscribe({
				next: posts => {
					this.posts = posts;
					if (posts.length > 0) {
						this.timeStamp = posts[posts.length - 1].createdOn;
					}

					this.isTryingToLoadPosts = false;
					if (this.isNearPageBottom()) {
						this.loadMorePosts();
					}
				}, error: () => {
					this.isTryingToLoadPosts = false;
					this.areAllPostsLoaded = true;
					console.log("Unable to get posts");
				}
			}
		);
	}

	loadMorePosts(): void {
		if (this.isTryingToLoadPosts || this.areAllPostsLoaded) {
			return;
		}
		this.getPostsRequest?.unsubscribe();
		this.isTryingToLoadPosts = true;
		this.getPostsRequest = this.postService
			.getAll({
				postType: this.postTypeFormControl.value,
				title: this.appliedTitleFilter,
				tags: this.appliedTagFilters,
				programmingLanguage: this.postTypeFormControl.value == "snippet" ? this.programmingLanguageFilter : undefined,
				timeStamp: this.timeStamp
			})
			.subscribe({
				next: posts => {
					if (posts.length == 0) {
						this.areAllPostsLoaded = true;
					}
					this.posts = this.posts.concat(posts);
					this.timeStamp = this.posts[this.posts.length - 1].createdOn;

					this.isTryingToLoadPosts = false;
					if (this.isNearPageBottom()) {
						this.loadMorePosts();
					}
				},
				error: () => {
					this.isTryingToLoadPosts = false;
					this.areAllPostsLoaded = true;
					console.log("Unable to get posts");
				}
			}
		);
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
		if (this.isNearPageBottom()) {
			this.loadMorePosts();
		}
	}

	isNearPageBottom() {
		this.changeDetector.detectChanges();
		//In chrome and some browser scroll is given to body tag
		const position = (document.documentElement.scrollTop || document.body.scrollTop) + document.documentElement.offsetHeight;
		const max = document.documentElement.scrollHeight;
		return max - position < 100;
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
			event.stopPropagation();
			this.applyTitleFilter();
		}
	}

	public toggleAdvancedSearch() {
		this.searchPanel?.toggle();
		if (this.tagAutocomplete) {
			this.tagAutocomplete.closePanel();
		}
	}

	private _filterTags(value: string): string[] {
		const filterValue = value.toLowerCase();

		return this.allTagOptions.filter(tag => tag.toLowerCase().includes(filterValue) && !this.appliedTagFilters.includes(tag));
	}

	addTagFilter(event: MatChipInputEvent): void {
		let value: string | undefined = (event.value || '').trim();
		value = this.allTagOptions.find(t => t.toLowerCase() == value?.toLowerCase());

		if (value) {
			if (this.appliedTagFilters.every(t => t != value)) {
				this.appliedTagFilters.push(value);
			}
		}

		if (this.tagAutocomplete) {
			this.tagAutocomplete.closePanel();
		}

		this.tagFormControl.reset();
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
		this.searchPanel?.open();
		this.tagAutocomplete?.closePanel();
		this.filterPosts();
	}

	applyTitleFilter() {
		this.appliedTitleFilter = this.unappliedTitleFilter;
		this.filterPosts();
	}
}
