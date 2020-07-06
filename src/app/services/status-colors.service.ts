import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StatusColorsService {
    
    public get statusColors(){
	return StatusColorsService.statusColors;
    }
    public static statusColors = {
        webrtc :
	    {
	        perConnectionStates :
		    {
		    new : '#002eab',
		    connecting : '#00a9ab',
		    connected : '#009724',
		    disconnected : '#8d8d8d',
		    failed : '#ac3400',
		    closed : '#aa0a00'
		    },
		iceConnectionState :
		    {
	            new : '#002eab',
		    checking : '#00a9ab',
		    connected : '#009724',
		    completed : '#009724',
		    disconnected : '#8d8d8d',
		    failed : '#ac3400',
		    closed : '#aa0a00'
	        }
	    }
    };
    
  constructor() { }
  
}
