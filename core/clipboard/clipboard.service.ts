import { Injectable } from '@angular/core';

@Injectable()
export class ClipboardService {
  public copy(text: string, input?: HTMLInputElement): void {
    if (input) {
      input.select();
      input.setSelectionRange(0, 99999);

      document.execCommand('copy');
    } else {
      const el = document.createElement('textarea');
      el.value = text;
      el.setAttribute('readonly', '');
      el.style.position = 'absolute';
      el.style.zIndex = '-9999';
      document.body.appendChild(el);
      el.select();
      document.execCommand('copy');
      document.body.removeChild(el);
    }
  }
}
