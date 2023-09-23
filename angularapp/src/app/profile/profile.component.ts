import { Component, OnInit } from '@angular/core';
import { UserService } from '../_services/user.service';

@Component({
	selector: 'app-profile',
	templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnInit {
	content?: string;

	constructor(private userService: UserService) { }

	ngOnInit(): void {
		this.userService.getUserData().subscribe({
			next: data => {
				this.content = data.username;
			},
			error: err => {
				console.log(err)
				if (err.error) {
					this.content = JSON.parse(err.error).message;
				} else {
					this.content = "Error with status: " + err.status;
				}
			}
		});
	}
}
