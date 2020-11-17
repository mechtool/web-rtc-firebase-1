import {Component, EventEmitter, HostListener, Input, Output} from '@angular/core';
import {Contact} from "../../../classes/Classes";

@Component({
  selector: 'app-contact-item',
  templateUrl: './contact-item.component.html',
  styleUrls: ['./contact-item.component.css'] ,
})
export class ContactItemComponent {
  
    @Input() public context : Contact;
    @Output() public selectedItem  = new EventEmitter();
    @HostListener('click', ['$event.currentTarget']) async onClickItem(current){
	    this.selectedItem.emit({context : this.context, current : current});
    }
    
    
    constructor() { }
}
