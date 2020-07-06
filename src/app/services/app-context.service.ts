import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Select, Store} from "@ngxs/store";
import {Actions} from "../store/actions";
import AppUserAction = Actions.AppUserAction;
import {Observable} from "rxjs";
import {Contact} from "../classes/Classes";
import { AppContextState} from "../store/states";

@Injectable({
  providedIn: 'root'
})
export class AppContextService {
    @Select(AppUserAction) public appUser$: Observable<Contact>;
    
    public recaptchaVerifier;
    public confirmation;
    constructor(
      public store : Store,
      public http : HttpClient) {
  }
  
  initialize(){
      return new Promise((res, rej)=>{
          res();
      })
  }
  filterAppUser(coll){
      let user =  this.store.selectSnapshot(AppContextState.appUser);
      return coll.filter(cont => {
          return cont._id !== user.uid ;
      })
  }
  
    getState(outlet){
	return outlet.activatedRouteData.type;
    }
    clearRecaptcha(){
	if(this.recaptchaVerifier && this.recaptchaVerifier.clear) {
	    this.recaptchaVerifier.clear();
	    this.recaptchaVerifier = undefined;
	}
    }
    
}
