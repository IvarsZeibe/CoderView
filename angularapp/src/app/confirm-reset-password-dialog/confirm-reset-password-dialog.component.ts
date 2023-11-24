import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ControlPanelService } from '../_services/control-panel.service';

@Component({
  selector: 'app-confirm-reset-password-dialog',
  templateUrl: './confirm-reset-password-dialog.component.html',
  styleUrls: ['./confirm-reset-password-dialog.component.css']
})
export class ConfirmResetPasswordDialogComponent {
	userId: string;
	newPassword = '';

	constructor(
		@Inject(MAT_DIALOG_DATA) userId: string,
		private controlPanelService: ControlPanelService
	) {
		this.userId = userId;
	}

	resetPassword() {
		this.controlPanelService.resetPassword(this.userId).subscribe(response => {
			this.newPassword = response.value;
		});
	}

	isPasswordReset = () => !!this.newPassword;

}
