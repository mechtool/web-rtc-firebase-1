import { Component} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Location} from "@angular/common";

@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.css']
})
export class HelpComponent  {
  
  constructor(public activatedRoute : ActivatedRoute,
	      private location : Location) {}
    onReady(){
      this.location.back();
    }

}
