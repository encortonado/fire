import { WelcomeComponent } from './welcome/welcome.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';

import { WelcomePageRoutingModule } from './welcome-routing.module';
import { HttpClient, HttpClientModule } from '@angular/common/http';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    WelcomePageRoutingModule,
  ],
  declarations: [WelcomeComponent]
})
export class HomePageModule {}
