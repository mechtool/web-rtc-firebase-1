import { Injectable } from '@angular/core';
import {BreakpointObserver} from "@angular/cdk/layout";
@Injectable({
  providedIn: 'root'
})
export class BreakPointService {
    is360 = false;
    is480 = false;
    portrait = false;
    landscape = false;
    subscription = [];
    constructor(breakpointObserver: BreakpointObserver) {
	this.subscription.push(breakpointObserver.observe([
	    '(max-width:360px)' ,
	    '(max-width:480px)' ,
	    '(orientation:portrait)',
	    '(orientation:landscape)'
	]).subscribe(result => {
	    this.is360 = result.breakpoints['(max-width:360px)']  ;
	    this.is480 = result.breakpoints['(max-width:480px)']  ;
	    this.landscape = result.breakpoints['(orientation:landscape)']  ;
	    this.portrait = result.breakpoints['(orientation:portrait)']  ;
	}));
    }
}
