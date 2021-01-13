import { Component, OnInit } from '@angular/core';
import {LocalizationService} from "../../../../../services/localization.service";
import {Router} from "@angular/router";
import {BreakPointService} from "../../../../../services/break-point.service";

@Component({
  selector: 'app-sms-rates',
  templateUrl: './sms-rates.component.html',
  styleUrls: ['./sms-rates.component.css']
})
export class SmsRatesComponent implements OnInit {

  constructor(
      public router : Router,
      public breakPoints : BreakPointService,
      public localizationService : LocalizationService,
  ) { }

  ngOnInit(): void {
  }
  onClickButton(){
    this.router.navigateByUrl('/application/main/sms-setting');
  }

}
