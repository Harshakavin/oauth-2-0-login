import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import {FacebookService} from '../services/facebook.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  public authCodeStatus: number = 1;
  public authCode: string = "";
  public accessToken: string = "";
  public userImages: any[] = [];
  public username: string;
  public allURLImages: any[] = [];
  public mobileUploadId: string ='';

  constructor(private router: Router,private route: ActivatedRoute, private apiServices: FacebookService) {
    console.log(window.location.href);
    console.log(window.location.href.toString().split("=")[1]);
    if(window.location.href.toString().split("=")[1] !== undefined) {
      console.log(window.location.href.toString().split("=")[1]+" ------");
      this.authCode = window.location.href.toString().split("=")[1];
      this.authCodeStatus = 2;
    }else{
      this.authCodeStatus = 1;
    }
    console.log(window.sessionStorage.getItem('images'));
    if(window.sessionStorage.getItem('images')){
      try {
        this.allURLImages = JSON.parse(window.sessionStorage.getItem('images'));
      }catch (err){
        window.sessionStorage.setItem('images',null);
        this.allURLImages = [];
        this.authCodeStatus = 1;
      }
    }else{
      window.sessionStorage.setItem('images',null);
      this.allURLImages = [];
      this.authCodeStatus = 1;
    }
  }

  ngOnInit() {

  }

  getAuthorize() {
    console.log("called");
    console.log(this.apiServices.getAuthCode());
    window.location.href = this.apiServices.getAuthCode();
  }

  getAccess() {
  this.route.queryParams.subscribe(params => {
    this.authCode = params['code'];
    console.log(this.authCode)
  });
  try{
    const data = this.apiServices.getAccessToken(this.authCode);
    data.subscribe((data1:any) => {

        this.accessToken = data1["access_token"];
        console.log(JSON.stringify(data1));
        this.authCodeStatus = 3;

    }, error2 => {
       console.log(error2);
       this.authCodeStatus = 1;
    });
    } catch(err) {
    console.log(err.toString())
   }
 }

  getResources(){
    try{
      this.getUserName();
      this.userImages = [];
      this.allURLImages = [];
    const data = this.apiServices.getUserAlbums(this.accessToken);
    data.subscribe((data2:any) => {
        console.log(JSON.stringify(data2));
        data2["data"].forEach( element => {
         if(element["name"] === "Mobile Uploads"){
           console.log(element["id"]);
            this.apiServices.getMobileUploadImages(this.accessToken,element["id"]).subscribe( data4 =>{
               console.log(JSON.stringify(data4));
               this.userImages = data4["data"];
               this.userImages.forEach( element => {
                 console.log(this.getImageUrl(element['id']));
                 this.getImageUrl(element['id']).then( url=>{
                    this.allURLImages.push({'name': element['name'], 'url': url });
                    window.sessionStorage.setItem('images',JSON.stringify(this.allURLImages));
                 });
               });
               this.getUserName();
            }, error3 => {
               console.log(error3);
                this.userImages = [];
            });
         }
        });
    }, error2 => {
       console.log(error2);
       this.authCodeStatus = 1;
    });
    } catch(err) {
    console.log(err.toString())
   }
  }
  public getUserName(){
    this.apiServices.getName(this.accessToken).subscribe(data5 =>{
               console.log(data5);
               this.username = data5.name;
            }, error3 => {
               this.username = "Your Images !"
            });
  }

   public getImageUrl(id: string): Promise<string> {
    return new Promise(resolve => {
       this.apiServices.getImage(this.accessToken,id).subscribe(data5 =>{
               console.log(JSON.parse(data5));
               resolve("https://www.google.lk/url?sa=i&source=images&cd=&cad=rja&uact=8&ved=2ahUKEwjvjI_47KTeAhUGSo8KHfyxBCIQjRx6BAgBEAU&url=http%3A%2F%2Fwww.bsmc.net.au%2Fdrjol%2Fno-image-available%2F&psig=AOvVaw1AHz8xIzsnLu9nM81jIHxM&ust=1540668867284697");
            }, error3 => {
               resolve(error3.url);
            });
    });
   }
   public logout(){
    window.sessionStorage.setItem('images',null);
    this.allURLImages = [];
    this.router.navigate(['home']);
   }
}
