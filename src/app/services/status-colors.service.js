var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var StatusColorsService_1;
import { Injectable } from '@angular/core';
let StatusColorsService = StatusColorsService_1 = class StatusColorsService {
    constructor() { }
    get statusColors() {
        return StatusColorsService_1.statusColors;
    }
};
StatusColorsService.statusColors = {
    webrtc: {
        perConnectionStates: {
            new: '#002eab',
            connecting: '#00a9ab',
            connected: '#009724',
            disconnected: '#8d8d8d',
            failed: '#ac3400',
            closed: '#aa0a00'
        },
        iceConnectionState: {
            new: '#002eab',
            checking: '#00a9ab',
            connected: '#009724',
            completed: '#009724',
            disconnected: '#8d8d8d',
            failed: '#ac3400',
            closed: '#aa0a00'
        }
    }
};
StatusColorsService = StatusColorsService_1 = __decorate([
    Injectable({
        providedIn: 'root'
    })
], StatusColorsService);
export { StatusColorsService };
