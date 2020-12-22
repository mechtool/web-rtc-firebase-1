var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Component } from '@angular/core';
import { Select } from "@ngxs/store";
import { AppContextState } from "../../../store/states";
let OnlineComponent = class OnlineComponent {
    constructor(router, themeColorService, route) {
        this.router = router;
        this.themeColorService = themeColorService;
        this.route = route;
        this.subscriptions = [];
    }
    ngOnInit() {
        this.prevUrl = this.route.snapshot.paramMap.get('previousUrl');
        this.subscriptions.push(this.onLine$.subscribe(online => {
            online && this.onAutonomy();
        }));
    }
    ngAfterViewInit() {
        this.setAnimation();
    }
    ngOnDestroy() {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }
    setAnimation() {
        let s = Snap('#webIcon');
        animatePath(s);
        function animatePath(p) {
            p.animate({ opacity: 0 }, 1000, () => {
                p.attr({ opacity: 1 });
                animatePath(p);
            });
        }
    }
    getAlarmColor() {
        return this.themeColorService.logoItems['third-theme'].c2;
    }
    onAutonomy() {
        this.router.navigate([this.prevUrl]).then(() => { });
    }
    onReload() {
        window.location.reload();
    }
};
__decorate([
    Select(AppContextState.onLine)
], OnlineComponent.prototype, "onLine$", void 0);
OnlineComponent = __decorate([
    Component({
        selector: 'app-online',
        templateUrl: './online.component.html',
        styleUrls: ['./online.component.css']
    })
], OnlineComponent);
export { OnlineComponent };
