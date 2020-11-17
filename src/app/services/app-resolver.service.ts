import { Injectable } from '@angular/core';
import {Resolve} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {Store} from "@ngxs/store";
import {Actions} from "../store/actions";
import StunTurnConfigAction = Actions.StunTurnConfigAction;

@Injectable({
  providedIn: 'root'
})
export class AppResolverService implements Resolve<any> {

  constructor(private http : HttpClient,
	      public store : Store) { }
    
  resolve(): Promise<any> {
      return Promise.all([
          //Запрс конфигурации turn сервера
	  this.http.get('/assets/js/stunTurnConfig.json').toPromise().then(res => {
	      this.store.dispatch(new StunTurnConfigAction(res));
	      return res;
	  }),
      ]).catch(err => console.log(err));
    }
}
