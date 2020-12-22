var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Component } from '@angular/core';
import { ColorThemeService } from "../../../services/color-theme.service";
import { AppContextState } from "../../../store/states";
let LogoImageComponent = class LogoImageComponent {
    constructor(store) {
        this.store = store;
        this.svgClass = 'rad';
        this.points = false;
        this.circles = [
            { r: '20%', cx: '50%', cy: '50%', className: 'circle1', circle: undefined },
            { r: '20%', cx: '50%', cy: '50%', className: 'circle2', circle: undefined },
        ];
        this.logoData = [
            { className: 'c0', cx: '250', cy: '250', r: '250', fill: '#b6c9fc' },
            { className: 'c1', cx: '250', cy: '250', r: '200', fill: '#6f98fc' },
            { className: 'c2', cx: '250', cy: '250', r: '150', fill: '#3163fc' },
            { className: 'c3', cx: '180', cy: '250', r: '25', fill: '#fff' },
            { className: 'c4', cx: '250', cy: '250', r: '25', fill: '#fff' },
            { className: 'c5', cx: '320', cy: '250', r: '25', fill: '#fff' },
        ];
        let colorClass = this.store.selectSnapshot(AppContextState.appColorClass);
        this.logoData.forEach(data => {
            data.fill = ColorThemeService.logoItems[colorClass][data.className];
        });
        this.offset = ColorThemeService.logoItems[colorClass]['c0'];
    }
    ngAfterViewInit() {
        this.startAnimation();
    }
    startAnimation() {
        let s = Snap('#snap');
        this.circles[0].circle = s.select('.circle1');
        this.circles[1].circle = s.select('.circle2');
        animateCircle(this.circles[0].circle);
        let t = setTimeout(() => {
            clearTimeout(t);
            animateCircle(this.circles[1].circle);
        }, 1000);
        function animateCircle(c) {
            c.animate({ r: '50%', opacity: 0 }, 2000, undefined, () => {
                c.attr({ r: '20%', opacity: .8 });
                animateCircle(c);
            });
        }
    }
    ngOnInit() {
    }
};
LogoImageComponent = __decorate([
    Component({
        selector: 'app-logo-image',
        templateUrl: './logo-image.component.html',
        styleUrls: ['./logo-image.component.css']
    })
], LogoImageComponent);
export { LogoImageComponent };
