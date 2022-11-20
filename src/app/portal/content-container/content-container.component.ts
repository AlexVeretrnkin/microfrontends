import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';
import { RoutesEnum } from '../../routes.enum';

@Component({
  selector: 'app-container',
  templateUrl: './content-container.component.html',
  styleUrls: ['./content-container.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ContentContainerComponent implements OnInit {
  public currentUrl$!: Observable<string>;

  private readonly excludedUrls: string[] = [RoutesEnum.userProfile, RoutesEnum.mainOverview];

  constructor(
    private activatedRoute: ActivatedRoute
  ) { }

  public ngOnInit(): void {
    this.currentUrl$ = this.activatedRoute.url.pipe(
      map(_ => this.activatedRoute.snapshot.children[0].url[0].path.replace('-', ''))
    );
  }

  public isHeaderHidden(url: string): boolean {
    return !this.excludedUrls.includes(url) && !this.activatedRoute.snapshot.children[0].paramMap.keys.length;
  }
}
