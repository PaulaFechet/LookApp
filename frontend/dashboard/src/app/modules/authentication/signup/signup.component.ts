import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  public registerForm: FormGroup;

  public successfulMessage : string = '';
  public errorMessage: string = '';
  public submitted = false;

  get registerFormControls() {
    return this.registerForm.controls;
  }

  constructor(
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      email: ['', Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")],
      password: ['', Validators.required],
      username: ['', Validators.required],
      confirm_password: ['', Validators.required]

    })
  }

  public get passwordControl(): FormControl {
    return this.registerForm.controls.password as FormControl;
  }

  onSubmit() {
    this.errorMessage = '';
    this.submitted = true;
    this.successfulMessage = '';

    if (this.registerFormControls.password.value == '' || this.registerFormControls.email.value == '') {
      this.errorMessage = 'Please fill the following fields.';
      return;
    }

    if (this.registerFormControls.email.invalid) {
      this.errorMessage = "Please use a valid email.";
      return;
    }

    if (this.registerFormControls.password.value != this.registerFormControls.confirm_password.value) {
      this.errorMessage = 'Passwords do not match';
      return;
    } else {
      this.submitted = true;
      this.authenticationService.register(this.registerFormControls.username.value, this.registerFormControls.email.value, this.registerFormControls.password.value)
        .pipe(first())
        .subscribe(() => {
          this.successfulMessage = 'You have successfully been registered.';
          // this.router.navigateByUrl('/login');
        },
          (error) => {
            console.log(error);
            this.errorMessage = error.error;
          }
        );
    }
  }

}
