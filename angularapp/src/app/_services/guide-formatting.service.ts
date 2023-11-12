import { Injectable } from '@angular/core';

export type GuideContent = { title: string, content: string }[]

@Injectable({
  providedIn: 'root'
})
export class GuideFormattingService {

	stringToObject(content: string): GuideContent {
		return JSON.parse(content);
	}

	objectToHtml(content: GuideContent): string {
		const container = document.createElement('div');
		for (const section of content) {
			const sectionElement = document.createElement('div');

			const heading = document.createElement('h1');
			heading.textContent = section.title;
			sectionElement.appendChild(heading);


			const content = document.createElement('p');
			content.textContent = section.content;
			sectionElement.appendChild(content);

			container.appendChild(sectionElement);
		}
		console.log(container);
		return container.innerHTML;
	}

	stringToHtml(content: string): string {
		return this.objectToHtml(this.stringToObject(content));
	}
}
