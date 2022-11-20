import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';

import { AuthGuard } from './auth-guard/auth.guard';

import { AuthService } from './auth/auth.service';

import { CamelCaseHelperService } from './camel-case-helper/camel-case-helper.service';

import { TokenInterceptorService } from './token-interceptor/token-interceptor.service';
import { CamelCaseInterceptorService } from './camel-case-interceptor/camel-case-interceptor.service';
import { ValidatorService } from './validator/validator.service';

@NgModule(
  {
    imports: [
      CommonModule,
      HttpClientModule
    ],
    providers: [
      AuthService,
      AuthGuard,
      CamelCaseHelperService,
      TokenInterceptorService,
      CamelCaseInterceptorService,
      ValidatorService
    ]
  })
export class BaseCoreModule {
}
