import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { first } from 'rxjs/operators';
import { AuthenticationService } from 'src/app/shared/services/authentication.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {

  registerForm: FormGroup;
  submitted = false;
  error = '';
  missMatchedPasswordError = '';

  constructor(
    private formBuilder: FormBuilder,
    private authenticationService: AuthenticationService,
    private route: ActivatedRoute,
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

  get f() {
    return this.registerForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    if (this.f.password.value != this.f.confirm_password.value) {
      this.missMatchedPasswordError = 'Passwords do not match';

    } else {
      this.submitted = true;
      this.authenticationService.register(this.f.username.value, this.f.email.value, this.f.password.value)
        .pipe(first())
        .subscribe((res) => {
          console.log("ok!")
          console.log(res);
          this.router.navigateByUrl('/login');
        },
          (error) => {
            this.error = error;
            console.log(error);
          }
        );
      console.log("it's perfect!");
    }
  }
}
