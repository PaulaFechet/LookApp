import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Output() toggleSideBarEmitter: EventEmitter<any> = new EventEmitter();
  public username: string;

  constructor(
    private readonly router: Router,
    private readonly authenticationService: AuthenticationService
  ) { }

  ngOnInit(): void {
    let userEmail = JSON.parse(sessionStorage.getItem('loggedInUser'))?.email;
    if (userEmail) {
      userEmail = userEmail.split("@")
      this.username = userEmail[0];
    }
  }

  toggleSideBar() {
    this.toggleSideBarEmitter.emit();
    setTimeout(() => {
      window.dispatchEvent(
        new Event('resize')
      );
    }, 300);
  }

  logout() {
    this.router.navigateByUrl('/login');
    this.authenticationService.logout();
  }
}
