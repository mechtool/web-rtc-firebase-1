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

  ngOnInit(): void {
  }
    
    onSelectedTab(event){
        this.router.navigateByUrl(this.tabs[event.index].link);
	}
  
}
