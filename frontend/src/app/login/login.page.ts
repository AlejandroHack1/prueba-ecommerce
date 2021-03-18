import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { JwtService } from '../jwt.service';
import { TokenAuthService } from '../token-auth.service';
import { AuthenticationStateService } from '../authentication-state.service';
import { AlertController, LoadingController } from '@ionic/angular';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  @ViewChild('email', { static: false }) email: any;
  @ViewChild('password', { static: false }) password: any;

  //authForm: FormGroup;

  constructor(
    public router: Router,
    public fb: FormBuilder,
    public jwtService: JwtService,
    private tokenAuthService: TokenAuthService,
    private authenticationStateService: AuthenticationStateService,
    public alertCtrl: AlertController,
    public loading: LoadingController
  ) {}

  ngOnInit() {}


  signUp() {
    this.router.navigateByUrl('/register');
  }

  async signIn() {
    if (this.email.value == '') {
      let alert = await this.alertCtrl.create({
        header: 'Atención',
        subHeader: 'Campo correo está vacio',
        buttons: ['OK'],
      });

      await alert.present();
    } else if (this.password.value == '') {
      let alert = await this.alertCtrl.create({
        header: 'Atención',
        subHeader: 'Campo contraseña está vacio',
        buttons: ['OK'],
      });

      await alert.present();
    } else {
      
      let data = {
        email: this.email.value,
        password: this.password.value,
      };

      let loader = await this.loading.create({
        message: 'Procesando por favor espera...',
      });

      await loader.present().then(() => {
        this.jwtService.logIn(data).subscribe(
          (res) => {
            this.tokenStorage(res);
            //this.password.setValue('');
            //this.email.setValue('');

            loader.dismiss();

          },

          async (err) => {
            console.log(err);
            loader.dismiss();

            let alert = await this.alertCtrl.create({
              header: 'ERROR',
              subHeader: 'Algo salió mal',
              buttons: ['OK'],
            });

            await alert.present();

            this.password.setValue('');
          },
          () => {
            this.authenticationStateService.setAuthState(true);
            this.router.navigate(['profile']);
          }
        );
      });
    }
  }

  tokenStorage(jwt) {
    this.tokenAuthService.setTokenStorage(jwt.token);
  }
}
