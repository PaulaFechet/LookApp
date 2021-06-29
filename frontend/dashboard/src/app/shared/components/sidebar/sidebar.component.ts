import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../services/authentication.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {

  public username : string = '';
  public userEmail : string = '';

  constructor(public router: Router,
    private readonly authenticationService: AuthenticationService) {}

  ngOnInit(): void {
    let userEmail = JSON.parse(sessionStorage.getItem('loggedInUser'))?.email;
    if (userEmail) {
      userEmail = userEmail.split("@")
      this.username = userEmail[0];
    }
  }

  logout() {
    this.router.navigateByUrl('/login');
    this.authenticationService.logout();
  }

}
