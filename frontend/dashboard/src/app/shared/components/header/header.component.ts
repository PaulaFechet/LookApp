import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import {UserService} from '../../services/user.service'
import {AuthenticationService} from '../../services/authentication.service'
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  @Output() toggleSideBarForMe: EventEmitter<any> = new EventEmitter();
  public username: string;

  constructor(

  private readonly router: Router,
  public readonly userService: UserService,
  public authenticationService: AuthenticationService

  ) { }

  ngOnInit(): void {
    try {
      let user = JSON.parse(localStorage.getItem('currentUser')).email;
      if(user!=null)
      {
        setTimeout(() => this.userService.username.next(user), 0);
      }
    } catch (error) {
      console.log(' — Nu exista user autentificat ', error.name);
      }
  }


  toggleSideBar() {
    this.toggleSideBarForMe.emit();
    setTimeout(() => {
      window.dispatchEvent(
        new Event('resize')
      );
    }, 300);
  }

  logout(){
    this.router.navigateByUrl('/login');
    this.authenticationService.logout();

  }

}
