import { Injectable } from '@angular/core';
import {Store} from "@ngxs/store";
import {AppContextState} from "../store/states";
let firebase = require('firebase/app');
require('firebase/database');
@Injectable({
  providedIn: 'root'
})
export class FirebaseDatabaseService {

    public database;
    public appUser = this.store.selectSnapshot(AppContextState.appUser);
  constructor(public store : Store) {
      this.database = firebase.database();
  }
  removeListeners(){
      //Отписка от всех обработчиков базы данных
      this.database.ref('/users').off('value');
      this.database.ref('/contacts').off('value');
      this.database.ref('/messages').off('value');
      this.database.ref('/announcements').off('value');

  }
    
    sendDescriptor(descriptor){
	return this.database.ref(`web-rtc/${descriptor.type}/${descriptor.contact.uid}/${descriptor.messId}`).set(descriptor);
    }
    
    getUserOnline(uid) {
	return this.database.ref(`/users/${uid}/online`).once('value');
    }
    
    getRef(ref){
	if(this.database) return this.database.ref(ref);
    }
    changeMessage(path, data){
	this.database.ref(path).update(data);
    }
    sendMessage(mess){
	this.database.ref(mess.path).set(mess);
    }
    
    deleteDescriptor(options){
	//Удалить дескриптор
	return this.database.ref(`web-rtc/${options.descriptor.type}/${options.descriptor.contact.uid}/${options.descriptor.messId}`).set(null)
    }
    
    setDescriptorOptions(options){
	return this.database.ref(`web-rtc/${options.descriptor.type}/${options.descriptor.contact.uid}/${options.descriptor.messId}`).update(options.data).catch(err => {
	    this.onError(err);
	});
    }
    
    onError(err){
	console.log(err);
    }
    
    async onErrorContactImg(event, context){
	//Если контакт пользователя сам поменял изображение, то ссылка на него меняется.
	//Вылетает ошибка загрузкти ресурса, поэтому перегружаем ресурс из объекта User
	let user = await this.getRef('/users/' + context.uid).once('value').then(userSnap => {
	    return userSnap.val();
	});
	if (user){
	    event.target.src = user.photoURL;
	    await this.setContacts({contactURL : '/contacts/' + this.appUser.uid +'/'+ context.uid, value : {photoURL : user.photoURL }}) ;
	}
    }
    setContacts(options){ //параметр - объект, где ключами являются идентификаторы  this.appContext.user.value.uid ,
	//а значениями - объекты контактов, в случае записи контакта или его изменении.
	//В случае удаления контакта, в значении должно быть null
	//Удаление или запись новых или измененных
	return this.database.ref(options.contactURL).update(options.value);
    }
  
}
