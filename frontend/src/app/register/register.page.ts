import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {LoadingController, AlertController,} from '@ionic/angular';
import { JwtService } from '../jwt.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
})
export class RegisterPage implements OnInit {
  authForm: FormGroup;

  @ViewChild('email', { static: false }) email: any;
  @ViewChild('name', { static: false }) name: any;
  @ViewChild('password', { static: false }) password: any;
  @ViewChild('password_confirmation', { static: false }) password_confirmation: any;
  submitted: boolean = false;

  constructor(
    public formBuilder: FormBuilder,
    public router: Router,
    public jwtService: JwtService,
    public alertCtrl: AlertController,
    public loading: LoadingController
  ) {}

  ngOnInit() {
    this.buildForm();
  }

  buildForm() {
    let EMAILPATTERN =
      '[A-Za-z0-9._%+-]{3,}@[a-zA-Z]{3,}([.]{1}[a-zA-Z]{2,}|[.]{1}[a-zA-Z]{2,}[.]{1}[a-zA-Z]{2,})';

    this.authForm = this.formBuilder.group({
      name: [
        '',
        [
          Validators.required,
          Validators.pattern('[a-zA-Z ]*'),
          Validators.minLength(4),
          Validators.maxLength(255),
        ],
      ],
      password: ['', [Validators.required, Validators.minLength(6)]],
      email: ['', [Validators.required, Validators.pattern(EMAILPATTERN)]],
      password_confirmation: ['', [Validators.required]],
     
    });
  }

  get errorControl() {
    return this.authForm.controls;
  }

  async Register() {
    this.submitted = true;

    if (!this.authForm.valid) {
      console.log('Por favor completa todos los datos!');
      return false;
    } else {
      if (this.password.value !== this.password_confirmation.value) {
        let alert = await this.alertCtrl.create({
          header: 'Error',
          message: 'Las contraseñas no coinciden.',
          buttons: ['OK'],
        });
        await alert.present();
        return;
      } else {


        let loader = await this.loading.create({
          message: 'Procesando por favor espere…',
        });

        await loader.present().then(() => {
          this.jwtService.signUp(this.authForm.value).subscribe(
            async (result) => {
              console.log(result);
              await loader.dismiss();

              this.authForm.reset();

              let alert = await this.alertCtrl.create({
                header: 'HECHO',
                subHeader: 'registro exitoso',
                buttons: ['OK'],
              });

              await alert.present();

              this.router.navigateByUrl('/login');
            },
            async (err) => {
              console.log(err);
              loader.dismiss();
              let alert = await this.alertCtrl.create({
                header: 'ERROR',
                subHeader: 'No se registró el usuario',
                buttons: ['OK'],
              });

              await alert.present();
            }
          );
        });
      }
    }
  }
}
