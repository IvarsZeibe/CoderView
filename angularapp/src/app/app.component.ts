import { Component, OnInit } from '@angular/core';
import { StorageService } from './_services/storage.service';
import { AuthService } from './_services/auth-service.service';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { ThemeService } from './_services/theme.service';

@Component({
	selector: 'app-root',
	templateUrl: './app.component.html',
	styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
	constructor(
		private storageService: StorageService,
		private authService: AuthService,
		private domSanitizer: DomSanitizer,
        private matIconRegistry: MatIconRegistry,
        private themeService: ThemeService
	) {
		this.matIconRegistry.addSvgIcon("profile", this.domSanitizer.bypassSecurityTrustResourceUrl("/assets/profile_icon.svg"));
	}

	ngOnInit(): void {
		this.authService.isLoggedIn().subscribe({
			next: isLoggedIn => {
				if (!isLoggedIn && this.storageService.isLoggedIn()) {
					this.storageService.clean();
					this.authService.forceRunAuthGuard();
				}
			},
			error: () => {
				this.storageService.clean();
				this.authService.forceRunAuthGuard();
			}
        });

        this.themeService.isLightTheme.subscribe({
            next: () => {
                this.setBackgroundImage();
            }
        });

		this.setBackgroundImage();
	}

	private setBackgroundImage() {
		const backgroundImage = this.generateBackground().toDataURL("image/png");

		const backgroundStyle = document.createElement("style");
		backgroundStyle.textContent = `body { background-image: url('${backgroundImage}'); }`;
		document.head.appendChild(backgroundStyle);
	}

	private generateBackground(): HTMLCanvasElement {
		const style = getComputedStyle(document.body);
		const backgorundColor1 = style.getPropertyValue('--background-color1');
		const backgorundColor2 = style.getPropertyValue('--background-color2');
		const canvas = document.createElement('canvas');
		canvas.width = screen.width;
		canvas.height = screen.height;
		const context = canvas.getContext('2d');
		const width = 50;
		const s = 5;
		if (context) {
			for (let x = 0; x < context.canvas.width / width; x++) {
				for (let y = 0; y < context.canvas.width / width; y++) {
					if (Math.abs((context.canvas.width / width - 4) / 2 - x) < 10 && Math.random() > 0.1) {
						continue;
					}
					const randomNumber = Math.random();
					let w = width;
					if (Math.random() > 0.7) {
						w += 55;
					}
					if (randomNumber > 0.9) {
						context.fillStyle = backgorundColor1;
					} else if (randomNumber > 0.7) {
						context.fillStyle = backgorundColor2;
					} else {
						continue;
					}
					context.beginPath();
					context.roundRect(x * (width + s) - context.canvas.width % width / 2, y * (width + s), w, w, 5);
					context.fill();
				}
			}
		}
		return canvas;
	}
	
}
