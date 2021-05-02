import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  public missMatchedPasswordError = '';

  private error = '';
  private submitted = false;

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
      email: ['', Validators.required],
      password: ['', Validators.required],
      username: ['', Validators.required],
      confirm_password: ['', Validators.required]

    })
  }

  onSubmit() {
    this.submitted = true;
    if (this.registerFormControls.password.value != this.registerFormControls.confirm_password.value) {
      this.missMatchedPasswordError = 'Passwords do not match';
    } else {
      this.submitted = true;
      this.authenticationService.register(this.registerFormControls.username.value, this.registerFormControls.email.value, this.registerFormControls.password.value)
        .pipe(first())
        .subscribe((res) => {
          this.router.navigateByUrl('/login');
        },
          (error) => {
            this.error = error;
          }
        );
    }
  }

}
