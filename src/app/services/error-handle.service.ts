import {ErrorHandler, Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ErrorHandleService {
    constructor() { }
}
@Injectable({
    providedIn: 'root'
})
export class AppErrorHandler implements ErrorHandler {
    handleError(error) {
	// do something with the exception
    }
}
