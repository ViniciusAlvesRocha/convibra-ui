import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { DOCUMENT, Title } from '@angular/platform-browser';
import { ɵgetDOM as getDOM } from '@angular/platform-browser';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { filter, map } from 'rxjs/operators';
import { AlertService } from './alert.service';

@Injectable({
  providedIn: 'root'
})
export class CommonService {

  constructor(private http: HttpClient,
              @Inject(DOCUMENT) private _doc: any,
              private titleService: Title,
              private activatedRoute: ActivatedRoute,
              private router: Router,
              private alertService: AlertService
    ) { }

  getInstanceSetting(searchParam){
    return this.http.get('/api/v1/common/get_instance_setting',{
        params:{"searchTerm":JSON.stringify(searchParam)}
    });
  }

  setTitle(_title){
    try
    {
      this.titleService.setTitle(_title);
    }
    catch(e)
    {
      console.warn("Unable to Set Title ",e);
    }
  }

  initTitle() {

    let appTitle = '';
    this.router
      .events.pipe(
        filter(event => event instanceof NavigationEnd),
        map(() => {
          let child = this.activatedRoute.firstChild;
          while (child.firstChild) {
            child = child.firstChild;
          }
          if (child.snapshot.data['title']) {
            return child.snapshot.data['title'];
          }
          return appTitle;
        })
      ).subscribe((title: string) => {
        /* Get App Name from Isntance Settings  */
        let paramData = ["general"];
        this.getInstanceSetting(paramData).subscribe(success => {
          
          appTitle = success['data'].general.homePageLeafletText;
          this.titleService.setTitle(title+" : "+appTitle);  

        }, error => {
          this.alertService.showError(error.message);
        })
      });
  }

  setFavicon(_link){
    try
    {
      let favicon = getDOM().querySelector(this._doc, "link[rel*='icon']")
      favicon.href = _link;
    }
    catch(e)
    {
      console.warn("Unable to Set Favicon ",e);
    }
  }
}
