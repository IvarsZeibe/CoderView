import { Component, OnInit } from '@angular/core';

@Component({
	selector: 'app-posts',
	templateUrl: './posts.component.html',
	styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit {
	posts: { id: string, title: string, content: string, author: string, commentCount: number, voteCount: number }[] = [];

	ngOnInit(): void {
		const content = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus ultricies libero vitae\
		nisl varius, ut semper nisi ultricies.Donec sit amet faucibus lectus, quis gravida leo.Phasellus tincidunt\
		malesuada volutpat.Cras at nunc quis nulla vehicula egestas sit amet et justo.Curabitur sodales porta tortor\
		id ullamcorper.Sed tortor tellus, vulputate a pulvinar non, fermentum at sapien.Nunc sit amet erat ipsum.Vivamus\
		sodales lectus vel elit egestas sollicitudin.Nam vel eros blandit, rhoncus risus eget, fringilla quam.Orci\
		varius natoque penatibus et magnis dis parturient montes, nascetur ridiculu";

		this.posts = [
			{
				id: "1",
				title: "Post1",
				content: content,
				author: "User1",
				commentCount: 182,
				voteCount: 642
			},
			{
				id: "2",
				title: "Post2",
				content: content,
				author: "User2",
				commentCount: 22,
				voteCount: 89
			},
			{
				id: "3",
				title: "Post3",
				content: content,
				author: "User3",
				commentCount: 123,
				voteCount: 42
			},
		];
	}
}
