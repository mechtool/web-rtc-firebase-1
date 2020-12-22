import {Component, Input, OnInit} from '@angular/core';
import {Contact} from "../../../classes/Classes";
import {Store} from "@ngxs/store";
import {LocalStorageState} from "../../../store/states";

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})
export class ContactComponent {

    public mode = '';
    @Input() public context : Contact;
  constructor(public store : Store) {
     this.mode = this.store.selectSnapshot(LocalStorageState.contactMode);
  }
  
  setFromPhone(){
      return `(${this.context.phoneCode}) ${this.context.phoneNumber}`;
  }
  
  onError(event){
    event.target.src = '/assets/icons/user.svg';
    return true;
}

}
