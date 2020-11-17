import {Component, OnDestroy, OnInit} from '@angular/core';
import {Select} from "@ngxs/store";
import {AppContextState} from "../../../store/states";
import {Observable} from "rxjs";
import {notificationAppearance} from "../../../animations/animations";
import {LocalizationService} from "../../../services/localization.service";

@Component({
  selector: 'app-permissions',
  templateUrl: './permissions.component.html',
  styleUrls: ['./permissions.component.css'],
    animations : [
	notificationAppearance
    ],
})
export class PermissionsComponent implements OnInit, OnDestroy {
  
    public subscribes = [];
  
  @Select(AppContextState.permissions) permissions$ : Observable<any[]> ;
    
    constructor(public localizationService : LocalizationService) {}

  ngOnInit(): void {}
  ngOnDestroy(): void {
        this.subscribes.forEach(sub => sub.unsubscribe());
  }
  
}
