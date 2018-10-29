import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import {RestService} from './api.service';
import {map} from 'rxjs/internal/operators';

@Injectable()
export class FacebookService extends RestService {

  appid: string = environment.appID;
  appSecret: string = environment.appSecret;

  protected get headers(): HttpHeaders {
    const headerConfig = {
      // 'Content-Type': 'application/json',
      // 'Accept': 'application/json'
    };
    return new HttpHeaders(headerConfig);
  }

  private getUrlEncode(text: string) {
    return encodeURIComponent(text);
  }
  // get request to get the authorization code
  public getAuthCode() :string {
    const redirect_uri = this.getUrlEncode('https://localhost:4200/home/code');
    const scope = this.getUrlEncode('user_birthday user_posts user_friends user_photos user_gender');
    return (`https://www.facebook.com/dialog/oauth?response_type=code&client_id=${this.appid}&redirect_uri=${redirect_uri}&scope=${scope}`);
  }
  // get request to get the access_token
  public getAccessToken(authCode: string): Observable<any> {
    const redirect_uri = this.getUrlEncode('https://localhost:4200/home/code');
    // tslint:disable-next-line:max-line-length
    const url = `https://graph.facebook.com/oauth/access_token?client_id=${this.appid}&redirect_uri=${redirect_uri}&client_secret=${this.appSecret}&code=${authCode}`;
    this.headers.set('Authorization', 'Basic ' + btoa(this.appid + ':' + this.appSecret));
    return this.get(url, this.headers);
  }
  // get request to get the albums
  public getUserAlbums(token: string): Observable<any> {
    const header = new HttpHeaders({'Authorization': 'Bearer ' + token});
    this.headers.set('Authorization', 'Bearer ' + token);
    const url = 'https://graph.facebook.com/v2.8/me/albums';
    return this.get(url, header);
  }
  // get request to the mobile uploaded image ids
  public getMobileUploadImages(token:string, id: string){
    const header = new HttpHeaders({'Authorization': 'Bearer ' + token});
    const url = 'https://graph.facebook.com/v2.8/'+id+'/photos';
    return this.get(url, header);
  }
  // get request to get the image 
  public getImage(token:string, id: string): Observable<any> {
    const header = new HttpHeaders({'Authorization': 'Bearer ' + token});
    const url = "https://graph.facebook.com/"+id+"/picture";
    return this.get(url, header);
  }
  // get request to get the user name
  public getName(token:string): Observable<any> {
    const header = new HttpHeaders({'Authorization': 'Bearer ' + token});
    const url = "https://graph.facebook.com/v2.8/me?fields=name";
    return this.get(url, header);
  }
}
