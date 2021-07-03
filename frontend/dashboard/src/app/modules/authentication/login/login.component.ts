import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../../shared/services/authentication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  public readonly loginForm: FormGroup;
  public invalidUsernameOrPasswordError: string = '';

  get loginFormControls() {
    return this.loginForm.controls;
  }

  constructor(
    private readonly formBuilder: FormBuilder,
    private readonly authenticationService: AuthenticationService,
    public readonly router: Router
  ) {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });

    // redirect to home if already logged in
    // TODO
  }

  onSubmit() {
    this.invalidUsernameOrPasswordError = '';
    this.authenticationService.login(this.loginFormControls.email.value, this.loginFormControls.password.value)
      .subscribe(
        (result) => {
          this.router.navigateByUrl('/categories');
        },
        (error) => {
          this.invalidUsernameOrPasswordError = 'Invalid username or password';
        }
      );
  };
}
