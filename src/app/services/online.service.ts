import {Injectable} from '@angular/core';
import {Store} from "@ngxs/store";
import {Actions} from "../store/actions";
import OnLineAction = Actions.OnLineAction;

@Injectable({
  providedIn: 'root'
})
export class OnlineService {

  constructor(public store : Store) {
      this.initialize();
  }
  
  initialize(){
      return new Promise((res, rej)=>{
	  window.addEventListener('online',  this.checkOnLine.bind(this));
	  window.addEventListener('offline', this.checkOnLine.bind(this));
	  this.checkOnLine();
	  res();
      })
  }
    
    checkOnLine(){
      this.store.dispatch(new OnLineAction(navigator.onLine));
  }
}
