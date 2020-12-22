import {AfterViewInit, Component, OnDestroy} from '@angular/core';
import {LocalizationService} from "../../../../../services/localization.service";
import {SmsService} from "../../../../../services/sms.service";
import {FormGroup} from "@angular/forms";
import {FormlyFieldConfig} from "@ngx-formly/core";
import {AppContextState} from "../../../../../store/states";
import {Select} from "@ngxs/store";
import {Observable} from "rxjs";
import {Contact} from "../../../../../classes/Classes";
import {ColorThemeService} from "../../../../../services/color-theme.service";
//Ссылка для получения текущего курса валют с сайта центрального банка России
//https://www.cbr-xml-daily.ru/latest.js
@Component({
  selector: 'app-sms-setting',
  templateUrl: './sms-setting.component.html',
  styleUrls: ['./sms-setting.component.css']
})
export class SmsSettingComponent implements  OnDestroy {
    
    public subscribes = [];
    public parseFloat = parseFloat;
    public smsHeader = this.localizationService.getText(122);
    public form = new FormGroup({});
    public model: any = {radio : 'AC', sum : '0', receiver :'41001510819857', formcomment :'Пополнение счета SMS сообщений', 'short-dest' : 'Пополнение счета SMS сообщений', label : 'order_id' , 'quickpay-form' : 'shop', targets : 'Оплата SMS трафика', 'need-fio' : false, 'need-email' :false, 'need-phone' :false, 'need-address' :false};
    public fields: FormlyFieldConfig[] = [
	{
	    key: 'radio',
	    type: 'radio',
	    className : 'sourceMoney',
	    templateOptions: {
	        description: 'Источник списания',
		attributes : {"aria-label" : "Источник списания"},
		required: true,
		options: [
		    { value: 'PC', label: 'ЮMoney'},
		    { value: 'AC', label: 'Банковской картой' },
		    { value: '"MC', label: 'С баланса мобильного' },
		],
	    },
	},
	{
	    key: 'sum',
	    type: 'input',
	    className : 'sumCurrency',
	    templateOptions: {
		appearance: 'fill',
		description: 'Сумма перевода',
		attributes : {"aria-label" : "Сумма перевода"},
		required: true,
	    },
	},
    ];
    @Select(AppContextState.appUserChanged) public appUserChanged$: Observable<Contact>;
    
    constructor(
        public smsService : SmsService,
        public colorThemeService : ColorThemeService,
        public localizationService : LocalizationService) {
    }
    

    ngOnDestroy() {
        
        this.subscribes.forEach(sub => sub.unsubscribe());
    }
    
    onSubmit() {
	console.log(this.model);
    }
    
    onIconClick(){
    
    }
}
