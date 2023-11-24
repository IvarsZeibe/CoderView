import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { DateHelperService } from '../_services/date-helper.service';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ManageUserDialogComponent } from '../manage-user-dialog/manage-user-dialog.component';
import { CommentData, ControlPanelService, PostData, UserData } from '../_services/control-panel.service';

@Component({
  selector: 'app-control-panel',
  templateUrl: './control-panel.component.html',
  styleUrls: ['./control-panel.component.css']
})
export class ControlPanelComponent implements OnInit, AfterViewInit {
	currentTime = new Date();

	postDataSource: MatTableDataSource<PostData> = new MatTableDataSource();
	displayedPostColumns: string[] = ['title', 'postType', 'author', 'commentCount', 'voteCount', 'createdOn', 'delete'];
	@ViewChild("postPaginator") postPaginator: MatPaginator | null = null;

	commentDataSource: MatTableDataSource<CommentData> = new MatTableDataSource();
	displayedCommentColumns: string[] = ['content', 'postTitle', 'author', 'replyCount', 'voteCount', 'createdOn', 'delete'];
	@ViewChild("commentPaginator") commentPaginator: MatPaginator | null = null;

	userDataSource: MatTableDataSource<UserData> = new MatTableDataSource();
	displayedUserColumns: string[] = ['username', 'email', 'isAdmin', 'commentCount', 'postCount', 'manage', 'delete'];
	@ViewChild("userPaginator") userPaginator: MatPaginator | null = null;

	constructor(
		public dateHelperService: DateHelperService,
		private dialog: MatDialog,
		private controlPanelService: ControlPanelService
	) { }

	ngOnInit() {
		this.updataData();
	}

	ngAfterViewInit() {
		this.postDataSource.paginator = this.postPaginator
		this.commentDataSource.paginator = this.commentPaginator;
		this.userDataSource.paginator = this.userPaginator;
	}

	updataData() {
		this.controlPanelService.getPosts().subscribe(posts => {
			this.postDataSource.data = posts;
		});
		this.controlPanelService.getComments().subscribe(comments => {
			this.commentDataSource.data = comments;
		});
		this.controlPanelService.getUsers().subscribe(users => {
			this.userDataSource.data = users;
		});
	}

	filterDataSource<T>(event: Event, dataSource: MatTableDataSource<T>) {
		const filterValue = (event.target as HTMLInputElement).value;
		dataSource.filter = filterValue.trim().toLowerCase();

		if (dataSource.paginator) {
			dataSource.paginator.firstPage();
		}
	}

	openPostDeleteDialog(postId: string) {
		this.dialog.open(DeleteDialogComponent, {
			data: {
				deleteAction: () => {
					this.controlPanelService.deletePost(postId).subscribe(() => {
						this.updataData();
					});
				},
				itemToDelete: 'post'
			}
		});
	}

	openCommentDeleteDialog(commentId: string) {
		this.dialog.open(DeleteDialogComponent, {
			data: {
				deleteAction: () => {
					this.controlPanelService.deleteComment(commentId).subscribe(() => {
						this.updataData();
					});
				},
				itemToDelete: 'comment'
			}
		});
	}

	openUserDeleteDialog(userId: string) {
		this.dialog.open(DeleteDialogComponent, {
			data: {
				deleteAction: () => {
					this.controlPanelService.deleteUser(userId).subscribe(() => {
						this.updataData();
					});
				},
				itemToDelete: 'user'
			}
		});
	}

	openManageUserDialog(userData: UserData) {
		this.dialog.open(ManageUserDialogComponent, {
			data: {
				userId: userData.id,
				username: userData.username,
				email: userData.email,
				isAdmin: userData.isAdmin,
				onDelete: () => { this.updataData() },
				onRoleChange: (isAdmin: boolean) => {
					this.userDataSource.data[this.userDataSource.data.findIndex(u => u.id = userData.id)].isAdmin = isAdmin;
				}
			}
		});
	}
}
