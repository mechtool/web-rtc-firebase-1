import { Injectable } from '@angular/core';
import {BreakpointObserver} from "@angular/cdk/layout";
@Injectable({
  providedIn: 'root'
})
export class BreakPointService {
    subscription = [];
    constructor(breakpointObserver: BreakpointObserver) {
	this.subscription.push(breakpointObserver.observe([
	    '(max-width: 360px)' ,
	    '(max-width: 300px)'
	]).subscribe(result => {
	    if (result.matches) {
		console.log('');
	    }
	}));
    }
}
