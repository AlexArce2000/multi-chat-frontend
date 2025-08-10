import { Injectable, Renderer2, RendererFactory2, Inject, PLATFORM_ID } from '@angular/core';
import { DOCUMENT } from '@angular/common';
@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  private renderer: Renderer2;
  private isDarkTheme = false;

  constructor(rendererFactory: RendererFactory2,
    @Inject(DOCUMENT) private document: Document
  ) {
    this.renderer = rendererFactory.createRenderer(null, null);
    this.loadTheme();
  }

  toggleTheme(): void {
    this.isDarkTheme = !this.isDarkTheme;
    this.updateTheme();
    this.saveTheme();
  }

  private updateTheme(): void {
    const themeClass = 'dark-theme';
    if (this.isDarkTheme) {
      this.renderer.addClass(this.document.body, themeClass);
    } else {
      this.renderer.removeClass(this.document.body, themeClass);
    }
  }
  private saveTheme(): void {
    localStorage.setItem('theme', this.isDarkTheme ? 'dark' : 'light');
  }

  private loadTheme(): void {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      this.isDarkTheme = savedTheme === 'dark';
      this.updateTheme();
    }
  }
}