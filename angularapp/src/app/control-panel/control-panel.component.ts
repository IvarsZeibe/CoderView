import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { DateHelperService } from '../_services/date-helper.service';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ManageUserDialogComponent } from '../manage-user-dialog/manage-user-dialog.component';
import { CommentData, ControlPanelService, PostData, UserData } from '../_services/control-panel.service';
import { ThemeService } from '../_services/theme.service';
import { CanvasJSChart } from '@canvasjs/angular-charts';

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
	displayedUserColumns: string[] = ['username', 'email', 'isAdmin', 'commentCount', 'postCount', 'createdOn', 'manage', 'delete'];
	@ViewChild("userPaginator") userPaginator: MatPaginator | null = null;

	@ViewChild("graph") graph: CanvasJSChart | null = null;

	chartOptions: any = {
		zoomEnabled: true,
		theme: "light2",
		title: {
			text: "Daily Posts"
		},
		data: []
	}
	graphType?: string = "posts";

	constructor(
		public dateHelperService: DateHelperService,
		private dialog: MatDialog,
		private controlPanelService: ControlPanelService,
		private themeService: ThemeService
	) { }

	ngOnInit() {
		this.updataData();
		this.themeService.isLightTheme.subscribe((isLightTheme) => {
			this.chartOptions = {
				...this.chartOptions,
				theme: isLightTheme ? 'light2' : 'dark2',
				backgroundColor: getComputedStyle(document.body).getPropertyValue("--surface-color"),
				toolbar: {
					buttonBorderColor: getComputedStyle(document.body).getPropertyValue("--comment-border"),
					itemBackgroundColor: '#b8c4f599'
				},
			};
			if (this.graph) {
				this.graph.shouldUpdateChart = true;
			}
		})
	}

	ngAfterViewInit() {
		this.postDataSource.paginator = this.postPaginator
		this.commentDataSource.paginator = this.commentPaginator;
		this.userDataSource.paginator = this.userPaginator;
	}

	totalUsers = () => this.userDataSource.data.length;
	totalPosts = () => this.postDataSource.data.length;
	totalComments = () => this.commentDataSource.data.length;

	setChartData() {
		const data: any[] = [];
		let dataset;
		switch (this.graphType) {
			case 'posts':
				dataset = this.postDataSource.data;
				break;
			case 'comments':
				dataset = this.commentDataSource.data;
				break;
			case 'users':
				dataset = this.userDataSource.data;
				break;
			default:
				return;
		}
		dataset.forEach(p => {
			const createdOn = new Date(p.createdOn.getFullYear(), p.createdOn.getMonth());
			const day = data.find((d: any) => {
				return d.x.getMonth() == createdOn.getMonth() && d.x.getFullYear() == createdOn.getFullYear();
			})
			if (day) {
				day.y++;
			}
			else {
				data.push({ x: createdOn, y: 1 });
			}
		});
		data.sort((a, b) => (b.x - a.x))
		this.chartOptions = {
			...this.chartOptions,
			title: {
				text: "Monthly New " + (this.graphType[0].toUpperCase() + this.graphType.substring(1))
			},
			axisX: {
				valueFormatString: "MMM YYYY",
			},
			data: [{
				type: 'line',
				dataPoints: data
			}]
		};
		if (this.graph) {
			this.graph.shouldUpdateChart = true;
		}
	}

	updataData() {
		this.controlPanelService.getPosts().subscribe(posts => {
			this.postDataSource.data = posts;
			this.setChartData();
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
