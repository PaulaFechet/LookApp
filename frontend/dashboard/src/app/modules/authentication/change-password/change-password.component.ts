import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})

export class ChangePasswordComponent implements OnInit {

  public changePasswordForm: FormGroup;
  public successfulMessage: string = '';

  public errorMessage: string = '';
  public submitted = false;

  get changePasswordFormControl() {
    return this.changePasswordForm.controls;
  }

  constructor(
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.changePasswordForm = this.formBuilder.group({
      email: ['', Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")],
      password: ['', Validators.required, Validators.minLength(8), Validators.pattern("(.*[A-Z].*[0-9].*)|(.*[0-9].*[A-Z].*)")],
      confirm_password: ['', Validators.required]

    })
  }

  onSubmit() {
    this.errorMessage = '';
    this.submitted = true;

    if (this.changePasswordFormControl.password.value == '' || this.changePasswordFormControl.email.value == '') {
      this.errorMessage = 'Please fill the following fields.';
      return;
    }

    if (this.changePasswordFormControl.email.invalid) {
      this.errorMessage = "Please use a valid email.";
      return;
    }

    if (this.changePasswordFormControl.password.invalid) {
      this.errorMessage = "The password does not respect the format.";
      return;
    }

    if (this.changePasswordFormControl.password.value != this.changePasswordFormControl.confirm_password.value) {
      this.errorMessage = 'Passwords do not match';
      return;
    } else {
      this.submitted = true;
      this.authenticationService.forgotPassword(this.changePasswordFormControl.email.value, this.changePasswordFormControl.password.value)
        .pipe(first())
        .subscribe(() => {
          this.successfulMessage = "You have succesfully changed your password.";
        },
          (error) => {
            console.log(error);
            this.errorMessage = 'You must be logged in so you can change your password.';
          }
        );
    }
  }

}
