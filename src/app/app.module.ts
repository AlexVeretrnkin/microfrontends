import { LOCALE_ID, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';

import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { IconSpriteModule } from 'ng-svg-icon-sprite';

import { BaseCoreModule, CamelCaseInterceptorService, TokenInterceptorService } from '@base-core';

import { SharedModule } from '@shared';

import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { registerLocaleData } from '@angular/common';

import localeUk from '@angular/common/locales/uk';

registerLocaleData(localeUk, 'uk');

@NgModule(
  {
    declarations: [
      AppComponent,
      LoginComponent,
      RegisterComponent
    ],
    imports: [
      BrowserModule,
      BrowserAnimationsModule,
      HttpClientModule,

      ReactiveFormsModule,

      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: (http: HttpClient) => new TranslateHttpLoader(http, './assets/i18n/', '.json'),
          deps: [HttpClient]
        }
      }),

      AppRoutingModule,
      BaseCoreModule,
      SharedModule,
      IconSpriteModule,
      ServiceWorkerModule.register('ngsw-worker.js', {
        enabled: environment.production,
        // Register the ServiceWorker as soon as the app is stable
        // or after 30 seconds (whichever comes first).
        registrationStrategy: 'registerWhenStable:30000'
      }),
    ],
    providers: [
      {
        provide: HTTP_INTERCEPTORS,
        useClass: CamelCaseInterceptorService,
        multi: true
      },
      {
        provide: HTTP_INTERCEPTORS,
        useClass: TokenInterceptorService,
        multi: true,
      },
      {
        provide: LOCALE_ID,
        useValue: 'uk'
      }
    ],
    bootstrap: [AppComponent]
  })
export class AppModule {
}
