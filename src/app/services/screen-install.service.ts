import {Injectable} from '@angular/core';
import {Store} from "@ngxs/store";
import {Actions} from "../store/actions";
import BeforeInstallAction = Actions.BeforeInstallAction;

@Injectable({
  providedIn: 'root'
})
export class ScreenInstallService {

  constructor(public store : Store) {}
  initialize(){
      return new Promise((res, rej)=>{
	  //Обработка события установки приложения на экран устройства
	  window.addEventListener("beforeinstallprompt", (beforeInstallPromptEvent) => {
	      //Управление переходит в этот обработчик, если приложение еще не установлено на экран (каждый раз)
	      //и не переходит, когда приложение уже установлено
	      beforeInstallPromptEvent.preventDefault(); // Предотвратить немедленный запуск отображения диалога
	      this.store.dispatch(new BeforeInstallAction(beforeInstallPromptEvent));
	  });
	  //прослушивание события 'appinstall' для определения установки приложения на экран устройства
	  window.addEventListener("appinstalled", (evt) => {
	      //Управление переходит в этот обработчик сразу (next tick) после принятия
	      //предложения об установки приложения один раз и больще никогда не переходит.
	      //приложение уже установлено на экран устройства
	      this.store.dispatch(new BeforeInstallAction(true));
	  });
	  res();
      });
  }
}
