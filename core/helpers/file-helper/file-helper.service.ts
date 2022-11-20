import { Injectable } from '@angular/core';

@Injectable()
export class FileHelperService {
  public downloadFileByUrl(fileUrl: string, fileName: string = 'file'): void {
    fetch(fileUrl)
      .then((response: Response) => response.blob())
      .then((url: Blob) => {
        const a = document.createElement('a');
        a.href = URL.createObjectURL(url);
        a.download = fileName;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
      });
  }
}
