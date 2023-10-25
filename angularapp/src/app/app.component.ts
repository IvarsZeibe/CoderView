import { Component, OnInit } from '@angular/core';
import { StorageService } from './_services/storage.service';
import { AuthService } from './_services/auth-service.service';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

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
		private matIconRegistry: MatIconRegistry
	) {
		this.matIconRegistry.addSvgIcon("profile", this.domSanitizer.bypassSecurityTrustResourceUrl("/assets/profile_icon.svg"));
	}

	ngOnInit(): void {
		this.authService.isLoggedIn().subscribe(isLoggedIn => {
			if (!isLoggedIn && this.storageService.isLoggedIn()) {
				this.storageService.clean();
				this.authService.forceRunAuthGuard();
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
						context.fillStyle = '#161d2c';
					} else if (randomNumber > 0.7) {
						context.fillStyle = '#242739';
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
