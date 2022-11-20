import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { catchError, switchMap, take } from 'rxjs/operators';

import { AuthService, ValidatorService } from '@base-core';

import { BaseUserModel } from '@models';

import { BehaviorSubject, Observable, of } from 'rxjs';

import { RoutesEnum } from '../routes.enum';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegisterComponent implements OnInit {
  public user$!: Observable<Partial<BaseUserModel & { invitee: { firstName: string, lastName: string } }>>;

  public isLinkVerified$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);

  public routesEnum: typeof RoutesEnum = RoutesEnum;

  public registerFormGroup!: FormGroup;

  private secretKey!: string;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private authService: AuthService,
    private validatorService: ValidatorService
  ) {
  }

  public ngOnInit(): void {
    this.secretKey = this.route.snapshot.paramMap.get(RoutesEnum.registerSecretKey)!;

    this.checkInviteLink();

    this.initRegisterForm();
  }

  public signUp(): void {
    this.authService.register(
      this.registerFormGroup.get('email')?.value,
      this.registerFormGroup.get('password')?.value,
      this.secretKey
    ).pipe(
      switchMap(() => this.authService.login(
        this.registerFormGroup.get('email')?.value,
        this.registerFormGroup.get('password')?.value
        )
      ),
      take(1)
    ).subscribe(
      _ => this.router.navigate(['portal']),
      _ => this.isLinkVerified$.next(false)
    );
  }

  private checkInviteLink(): void {
    this.user$ = this.authService.checkRegisterSecretKey(this.secretKey)
      .pipe(
        catchError(_ => {
          this.isLinkVerified$.next(false);

          return of(null!);
        })
      );
  }

  private initRegisterForm(): void {
    this.registerFormGroup = this.formBuilder.group({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required]),
      repeatPassword: new FormControl(''),
    });

    this.setRepeatPasswordValidators();
  }

  private setRepeatPasswordValidators(): void {
    this.registerFormGroup.get('repeatPassword')?.setValidators([
      this.validatorService.repeatPasswordValidator(this.registerFormGroup.get('password')!),
      Validators.required
    ]);

    this.registerFormGroup.get('repeatPassword')?.updateValueAndValidity();
  }
}
