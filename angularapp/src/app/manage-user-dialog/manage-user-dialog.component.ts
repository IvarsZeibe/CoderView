import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { DeleteDialogComponent } from '../delete-dialog/delete-dialog.component';
import { ConfirmResetPasswordDialogComponent } from '../confirm-reset-password-dialog/confirm-reset-password-dialog.component';
import { ControlPanelService } from '../_services/control-panel.service';

@Component({
  selector: 'app-manage-user-dialog',
  templateUrl: './manage-user-dialog.component.html',
  styleUrls: ['./manage-user-dialog.component.css']
})
export class ManageUserDialogComponent {
	userId: string;
	username: string;
	email: string;
	isAdmin = false;
	onDelete: () => void;
	onRoleChange: (isAdmin: boolean) => void;

	isPasswordReset = false;

	constructor(
		@Inject(MAT_DIALOG_DATA) data: {
			userId: string, username: string, email: string, isAdmin: boolean, onDelete: () => void, onRoleChange: (isAdmin: boolean) => void },
		private dialog: MatDialog,
		private controlPanelService: ControlPanelService
	) {
		this.userId = data.userId;
		this.username = data.username;
		this.email = data.email;
		this.isAdmin = data.isAdmin;
		this.onDelete = data.onDelete;
		this.onRoleChange = data.onRoleChange;
	}

	openConfirmDeleteAccountDialog() {
		this.dialog.open(DeleteDialogComponent, {
			data: {
				deleteAction: () => {
					this.dialog.closeAll();
					this.controlPanelService.deleteUser(this.userId).subscribe(() => {
						this.onDelete();
					});
				},
				itemToDelete: 'user'
			}
		});
	}

	openConfirmResetPasswordDialog() {
		this.dialog.open(ConfirmResetPasswordDialogComponent, {
			data: this.userId
		});
	}

	grantAdminPrivileges() {
		this.controlPanelService.grantAdminPrivileges(this.userId).subscribe(() => {
			this.onRoleChange(true);
		});
		this.isAdmin = true;
	}

	removeAdminPrivileges() {
		this.controlPanelService.removeAdminPrivileges(this.userId).subscribe(() => {
			this.onRoleChange(false);
		});
		this.isAdmin = false;
	}
}
