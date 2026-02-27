import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { Checkbox } from 'primeng/checkbox';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import {
  loginProviders,
  UserLoginUseCase,
} from '../../Identity.Application/usecases/user-login.usecase';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [
    TranslateModule,
    ReactiveFormsModule,
    PasswordModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    Checkbox,
  ],
  providers: [loginProviders],
})
export class LoginComponent implements OnInit {
  private readonly _fb = inject(FormBuilder);

  form: FormGroup;
  loading: boolean = false;
  errors = { detail: null, key: null };
  private readonly _route = inject(ActivatedRoute);
  private readonly _router = inject(Router);
  private readonly _userLoginUesCase = inject(UserLoginUseCase);

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {
    this.form = new FormGroup({
      email: new FormControl('', Validators.required),
      password: new FormControl('', Validators.required),
      rememberMe: new FormControl(''),
    });
  }

  ngOnInit() {}

  login() {
    this.loading = true;

    this._userLoginUesCase
      .execute({
        email: this.form.value.email,
        password: this.form.value.password,
        rememberMe: this.form.value.rememberMe,
      })
      .subscribe({
        next: (res) => {
          const returnUrl = this._route.snapshot.queryParams['returnUrl'];
          if (returnUrl) {
            this._router.navigateByUrl(returnUrl);
          } else {
            this._router.navigate(['/']);
          }
        },
        error: (err: HttpErrorResponse) => {
          this.loading = false;
          this.errors = err.error;
        },
      });
  }
}
