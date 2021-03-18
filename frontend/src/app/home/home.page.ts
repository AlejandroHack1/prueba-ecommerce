import { Component} from '@angular/core';
import { Router } from '@angular/router';
import { AuthenticationStateService } from '../authentication-state.service';
import { TokenAuthService } from '../token-auth.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  
  isLoggedin: boolean;

  constructor(
    public router: Router,
    private tokenAuthService: TokenAuthService,
    public authenticationStateService: AuthenticationStateService
  ) {
  }

  ngOnInit() {
    this.authenticationStateService.userAuthState.subscribe(res => {
        this.isLoggedin = res;
    });
  }

  logOut() {
    this.authenticationStateService.setAuthState(false);
    this.tokenAuthService.destroyToken();
    this.router.navigate(['signin']);
  }  

}