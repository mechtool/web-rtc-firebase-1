import { Component, OnInit } from '@angular/core';
import {SettingsDefaultService} from "../../services/settings-default.service";
import {ScreenInstallService} from "../../services/screen-install.service";
import {AppContextService} from "../../services/app-context.service";
import {PermissionsService} from "../../services/permissions.service";
import {fadeAnimation} from "../../animations/animations";

@Component({
  selector: 'app-application',
  templateUrl: './application.component.html',
  styleUrls: ['./application.component.css'] ,
    animations : [fadeAnimation]
})
export class ApplicationComponent implements OnInit {

  constructor(
      public appContextService : AppContextService,
      public defaultSettingsService : SettingsDefaultService,
      public permissionsService : PermissionsService,
      public screenInstallService : ScreenInstallService,
  ) { }

  ngOnInit(): void {
      this.initializeServices();
  }

  async initializeServices(){
      await this.defaultSettingsService.initialize();
      await this.screenInstallService.initialize();
      await this.appContextService.initialize();
      //todo Убрать заглушку на продакшн
      if(window.location.href.indexOf('localhost') === -1 ) await this.permissionsService.checkPermissions();
  }
}
