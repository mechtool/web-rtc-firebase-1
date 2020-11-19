import { Component, OnInit } from '@angular/core';
import {AppContextService} from "../../../services/app-context.service";
import {Router} from "@angular/router";
import {slideAnimation} from "../../../animations/animations";


@Component({
  selector: 'app-enter',
  templateUrl: './enter.component.html',
  styleUrls: ['./enter.component.css'] ,
    animations : [slideAnimation]
})
export class EnterComponent implements OnInit {

  public tabs = [
      {label : 'Phone', link : '/authorization/enter/phone'},
      {label : 'Email', link : '/authorization/enter/email'},
      {label : 'Anonymously', link : '/authorization/enter/anonymously'},
  ]
  constructor(
      public appContext : AppContextService,
      public router : Router) { }

  ngOnInit(): void {}
    
    onSelectedTab(event){
	this.checkRecaptcha() ;
        this.router.navigateByUrl(this.tabs[event.index].link);
    }
    
    checkRecaptcha(){
      //При переходе с одной закладки на другую, нужно удалить имеющуюся рекапчу, если она существует,
	//Иначе, её видно при выполнении анимации перехода компонента
	//todo Временное решение
    let rec = document.querySelector('div.grecaptcha-badge') ;
    rec && rec.parentElement.remove();
    }
  
}
