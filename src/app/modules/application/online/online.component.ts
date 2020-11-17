import {AfterViewInit, Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Select} from "@ngxs/store";
import {AppContextState} from "../../../store/states";
import {Observable} from "rxjs";
import {ColorThemeService} from "../../../services/color-theme.service";
import {LocalizationService} from "../../../services/localization.service";
declare let Snap;

@Component({
  selector: 'app-online',
  templateUrl: './online.component.html',
  styleUrls: ['./online.component.css']
})
export class OnlineComponent implements OnInit, OnDestroy, AfterViewInit {

    public prevUrl;
    public subscriptions = [];
    
    @Select(AppContextState.onLine) public onLine$ : Observable<boolean> ;
    
    constructor(
        public localizationService : LocalizationService,
        public router : Router,
        public themeColorService : ColorThemeService,
        public route : ActivatedRoute) { }

  ngOnInit(): void {
      this.prevUrl = this.route.snapshot.paramMap.get('previousUrl');
      this.subscriptions.push(this.onLine$.subscribe(online =>{
          online && this.onAutonomy();
      } ))
      
  }
  
  ngAfterViewInit() {
        this.setAnimation();
  }
    
    ngOnDestroy(): void {
        this.subscriptions.forEach(sub => sub.unsubscribe());
  }
  
  setAnimation(){
        let s = Snap('#webIcon');
        animatePath(s) ;
      function animatePath(p){
            p.animate({opacity : 0}, 1000,  ()=>{
                p.attr({opacity : 1});
                animatePath(p);
	    })
      }
  }
    getAlarmColor(){
        return this.themeColorService.logoItems['third-theme'].c2;
    }
    onAutonomy(){
	this.router.navigate([this.prevUrl]).then(()=>{});
    }
    
    onReload(){
	window.location.reload();
    }
}

