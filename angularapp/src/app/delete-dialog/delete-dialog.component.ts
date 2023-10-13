import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-dialog',
  templateUrl: './delete-dialog.component.html',
  styleUrls: ['./delete-dialog.component.css']
})
export class DeleteDialogComponent {
	public deleteAction: () => void;
	public itemToDelete: string;
	constructor(
		@Inject(MAT_DIALOG_DATA) data: { deleteAction: () => void, itemToDelete: string },
	) {
		this.deleteAction = data.deleteAction;
		this.itemToDelete = data.itemToDelete;
	}
}
