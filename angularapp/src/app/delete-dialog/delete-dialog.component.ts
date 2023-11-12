import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-delete-dialog',
  templateUrl: './delete-dialog.component.html',
  styleUrls: ['./delete-dialog.component.css']
})
export class DeleteDialogComponent {
	public deleteAction: () => void;
	public title = "";
	public content = "";
	constructor(
		@Inject(MAT_DIALOG_DATA) data: { deleteAction: () => void, itemToDelete?: string, title?: string, content?: string },
	) {
		this.deleteAction = data.deleteAction;
		if (data.title) {
			this.title = data.title;
		} else if (data.itemToDelete) {
			this.title = `Delete ${data.itemToDelete}`;
		} else {
			this.title = `Delete`;
		}
		if (data.content) {
			this.content = data.content;
		} else if (data.itemToDelete) {
			this.content = `Are you sure you want to delete this ${data.itemToDelete}?`;
		} else {
			this.content = "This action is irreversible."
		}
	}
}
