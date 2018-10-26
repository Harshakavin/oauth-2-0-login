import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Route } from '@angular/router';
import { AppComponent } from './app.component';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { HttpClientModule } from '@angular/common/http';
import {RestService} from './services/api.service';
import {FacebookService} from './services/facebook.service';

const ROUTES: Route[] = [
  { path: '', component: LoginComponent },
  { path: '*', component: HomeComponent },
  { path: 'home', component: HomeComponent },
  { path: 'home/:code', component: HomeComponent }
];
@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    HomeComponent

  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    RouterModule.forRoot(ROUTES),
    HttpModule,
    HttpClientModule
  ],
  providers: [ RestService, FacebookService],
  bootstrap: [AppComponent]
})

export class AppModule { }
