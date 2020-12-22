import {Component, Input, OnInit} from '@angular/core';
import {AppContextState} from "../../../store/states";
import {Store, Select} from "@ngxs/store";
import { LocalizationService } from 'src/app/services/localization.service';
import { Router } from '@angular/router';
import { Actions } from 'src/app/store/actions';
import ActivatedContactsAction = Actions.ActivatedContactsAction;
import { Observable } from 'rxjs';
import { Contact } from 'src/app/classes/Classes';


@Component({
  selector: 'app-setting-item',
  templateUrl: './setting-item.component.html',
  styleUrls: ['./setting-item.component.css']
})
export class SettingItemComponent implements OnInit {

  public appUser;
  public subscriptions = [];  
  @Input() public context : {
      type? : string,
      text? : string,
      value? : any,
      listener? : any,
      disabled? : boolean,
      svg? : string,
      className? : string,
      buttonText? : string,
      select? : {label : string, options : {text : string, disabled : boolean}[]}
  }  ;
    @Select(AppContextState.appUser) public appUser$ : Observable<Contact>; 
      constructor(
      public store : Store,
      public router : Router,
      public localizationService : LocalizationService) { }

  ngOnInit(): void {
    this.subscriptions.push(this.appUser$.subscribe(user =>{
      user && (this.appUser = user);
    }));
  }
  
  onClickAppUser(){
    this.store.dispatch(new ActivatedContactsAction([this.appUser]));
    this.router.navigate(['application', 'main', 'contact-detail'], {state : {from : 'settings'}});
  }
}

