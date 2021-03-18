import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { AuthHeaderService } from '../auth-header.service';
import { AuthenticationStateService } from '../authentication-state.service';
import { JwtService } from '../jwt.service';
import { TokenAuthService } from '../token-auth.service';

export class User {
  name: String;
  email: String;
}

export interface Config {
  pedidos: string;
}

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage {
  user: User;
  view: boolean = false;
  p: number = 1;

  
  //Defines an object allowing the interface properties to be accessed
  public config: Config;

  //Defines an object for storing the column definitions of the datatable

  public columns: any;

  //Defines an object for storing returned data to be displayed in the template

  public rows: any;
  items: any;
  showList: boolean = false;

  constructor(public jwtService: JwtService, public AuthHeaderService: AuthHeaderService, public tokenAuthService:TokenAuthService,
    public loading: LoadingController, public router: Router, public authenticationStateService: AuthenticationStateService) {


     const jwtHeaderToken = this.tokenAuthService.getJwtToken();
     const Authorization = 'Bearer ' + jwtHeaderToken;

    console.log(Authorization);

    this.jwtService.profile(Authorization).subscribe((res: any) => {
      this.user = res;
    });
  }

  async verPedidos(){

    this.view = true;

     let loader = await this.loading.create({
      message: 'Listando…',
    });

    await loader.present().then(() => {

      this.jwtService.getData()
        .subscribe(async data => {
          this.rows = data[0]['pedidos'];
          await loader.dismiss();
          console.log(this.rows);

        }, async err => {
          console.log(err);
          await loader.dismiss();

        });

    });

  }

    initializeItems() {
    this.items = this.rows;
    this.p = 1;
  }

  getItems(ev: any) {
    // Restablecer artículos de nuevo a todos los artículos
    this.initializeItems();
    this.showList = true;

    // set val to the value of the searchbar
    let val = ev.target.value;

    // si el valor es una cadena vacía no filtre los elementos
    if (val && val.trim() != '') {

      

      this.items = this.items.filter((item) => {
        return (item.fecha.indexOf(val) > -1);
      })
    }

      else {
      // oculta el resultado
      this.showList = false;

    }


  }

  onCancel(ev) {
    // oculta los resultados
    this.showList = false;

    // reestablece el campo
    ev.target.value = '';
  }
  


  salir(){
    this.authenticationStateService.setAuthState(false);
    this.tokenAuthService.destroyToken();
    this.router.navigate(['signin']);
    }

  
}
