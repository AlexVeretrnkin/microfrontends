import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@base-core';
import { take } from 'rxjs/operators';
import { RoutesEnum } from '../routes.enum';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnInit {
  public routesEnum: typeof RoutesEnum = RoutesEnum;

  public loginFormGroup!: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private authService: AuthService
  ) {
  }

  public ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.loginFormGroup = this.formBuilder.group({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required])
    });
  }

  public signIn(): void {
    this.authService.login(this.loginFormGroup.get('email')?.value, this.loginFormGroup.get('password')?.value)
      .pipe(take(1))
      .subscribe(() => {
        this.router.navigate(['portal']);
      });
  }

  public recover(): void {
    console.log('recover');
  }
}
