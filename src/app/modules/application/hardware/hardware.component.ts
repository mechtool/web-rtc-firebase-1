import {Component, OnDestroy, OnInit} from '@angular/core';
import { StatusIndicatorsState} from "../../../store/states";
import {Select, Store} from "@ngxs/store";
import {Observable} from "rxjs";
import {Router} from "@angular/router";
import {LocalizationService} from "../../../services/localization.service";

@Component({
  selector: 'app-hardware',
  templateUrl: './hardware.component.html',
  styleUrls: ['./hardware.component.css']
})
export class HardwareComponent implements OnInit, OnDestroy {

    public subscriptions = [];
    public hardware = [
	{type : 'videoinput', state : false, icon: '1', text : 'Видеокамера*' },
	{type : 'audioinput', state : false, icon: '2', text : 'Микрофон*'},
	{type : 'audiooutput', state : false , icon: 'sound', text : 'Динамики или наушники'},
    ];
    public text2 = '';
    public text1 = this.localizationService.getText(62);
    @Select(StatusIndicatorsState.hardwareStatus) hardwareStatus$ : Observable<any> ;
  
    constructor(
        public localizationService : LocalizationService,
        public router : Router,
      public store : Store) { }

  ngOnInit(): void {
      this.subscriptions.push(this.hardwareStatus$.subscribe(hardwareStatus => {
	  hardwareStatus && this.hardware.forEach(h => {
		  h.state = hardwareStatus.result.some(s  => s === h.type)  ;
	  });
      }));
  }
  ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
  }
    
    onClick(){
        let absents = this.hardware.filter(h => h.state);
 	if(absents.length === 1 && absents.some(h => h.state && h.type === 'audiooutput')) {
 	    this.router.navigateByUrl('/authorization/enter');
	} else{
 	    this.text2 = this.localizationService.getText(76);
	}
    }
    
}
