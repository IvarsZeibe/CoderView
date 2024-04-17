import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
	providedIn: 'root'
})
export class ThemeService {
	isLightTheme: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)

	toggleTheme() {
		if (document.body.classList.contains('light-theme')) {
			document.body.classList.remove('light-theme');
			document.body.classList.add('dark-theme');
			this.isLightTheme.next(false);
			localStorage.setItem('theme', 'dark');
		} else {
			document.body.classList.remove('dark-theme');
			document.body.classList.add('light-theme');
			this.isLightTheme.next(true);
			localStorage.setItem('theme', 'light');
		}
	}

	loadThemeFromLocalStorage() {
		const theme = localStorage.getItem('theme')
		if (theme == 'light') {
			this.toggleTheme();
		}
	}
}
