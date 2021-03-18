import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InventaryPageRoutingModule } from './inventary-routing.module';

import { InventaryPage } from './inventary.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InventaryPageRoutingModule
  ],
  declarations: [InventaryPage]
})
export class InventaryPageModule {}
