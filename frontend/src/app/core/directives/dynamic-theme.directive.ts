import { Directive, ElementRef, inject, effect } from '@angular/core';
import { PHASE_THEME } from '../tokens/theme.token';

@Directive({
  selector: '[appDynamicTheme]',
  standalone: true,
})
export class DynamicThemeDirective {
  private readonly theme = inject(PHASE_THEME);
  private readonly el = inject(ElementRef);

  constructor() {
    effect(() => {
      const theme = this.theme();
      const style = this.el.nativeElement.style;

      style.setProperty('--lp-primary', theme.colors.primary);
      style.setProperty('--lp-primary-light', theme.colors.primaryLight);
      style.setProperty('--lp-bg-card', theme.colors.bgCard);
      style.setProperty('--lp-bg-page', theme.colors.bgPage);
      style.setProperty('--lp-text', theme.colors.text);
      style.setProperty('--lp-text-muted', theme.colors.textMuted);
      style.setProperty('--lp-accent', theme.colors.accent);
      style.setProperty('--lp-radius-card', theme.radius.card);
      style.setProperty('--lp-radius-button', theme.radius.button);
      style.setProperty('--lp-radius-input', theme.radius.input);
      style.setProperty('--lp-font-family', theme.font.family);
      style.setProperty('--lp-font-size-base', theme.font.sizeBase);
      style.setProperty('--lp-font-size-heading', theme.font.sizeHeading);
      style.setProperty('--lp-shadow', theme.shadow);
    });
  }
}