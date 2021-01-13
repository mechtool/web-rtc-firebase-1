import { Injectable } from '@angular/core';
import {BreakpointObserver} from "@angular/cdk/layout";
@Injectable({
  providedIn: 'root'
})
export class BreakPointService {
    isWidth460 = false;
    portrait = false;
    landscape = false;
    subscription = [];
    constructor(breakpointObserver: BreakpointObserver) {
	this.subscription.push(breakpointObserver.observe([
	    '(max-width:460px)' ,
	    '(orientation:portrait)',
	    '(orientation:landscape)'
	]).subscribe(result => {
	    this.isWidth460 = result.breakpoints['(max-width:460px)']  ;
	    this.landscape = result.breakpoints['(orientation:landscape)']  ;
	    this.portrait = result.breakpoints['(orientation:portrait)']  ;
	}));
    }
}
