import {Component, OnDestroy} from '@angular/core';
import {LocalizationService} from "../../../../../services/localization.service";
import {FormGroup} from "@angular/forms";
import {FormlyFieldConfig} from "@ngx-formly/core";
import {AppContextState} from "../../../../../store/states";
import {Select, Store} from "@ngxs/store";
import {Observable} from "rxjs";
import {Contact} from "../../../../../classes/Classes";
import {BreakPointService} from "../../../../../services/break-point.service";
import {ColorThemeService} from "../../../../../services/color-theme.service";

//Ссылка для получения текущего курса валют с сайта центрального банка России
//https://www.cbr-xml-daily.ru/latest.js


@Component({
  selector: 'app-sms-setting',
  templateUrl: './sms-setting.component.html',
  styleUrls: ['./sms-setting.component.css'] ,
})
export class SmsSettingComponent implements  OnDestroy {
    
    public subscribes = [];
    public parseFloat = parseFloat;
    public totalSum;
    public comission;
    public f = new FormGroup({});
    public smsHeader = this.localizationService.getText(122);
	public user = this.store.selectSnapshot(AppContextState.appUser);
	public model: any = {radio : 'AC', sum : '', receiver :'41001510819857', formcomment :'Пополнение счета SMS сообщений', 'short-dest' : 'Пополнение счета SMS сообщений', label : 'order_id' , quickpayForm : 'shop', targets : 'Оплата SMS трафика', 'need-fio' : false, 'need-email' :false, 'need-phone' :false, 'need-address' :false};
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
		    { value: 'PC', label: 'ЮMoney', comission : 0.005},
		    { value: 'AC', label: 'Банковской картой' , comission : 0.02},
		    { value: '"MC', label: 'С баланса мобильного', comission : 1 },
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
		placeholder : '0',
		pattern : "[0-9]+" ,
		keydown : (field, event)=>{
		    return /Backspace|[0-9]+/.test(event.key)
		   }
	    },
	},
    ];
    @Select(AppContextState.appUserChanged) public appUserChanged$: Observable<Contact>;

    constructor(
    	public store : Store,
        public breakPoints : BreakPointService,
        public colorTheme : ColorThemeService,
        public localizationService : LocalizationService) {
        console.log('')
    }
    
    ngOnDestroy() {
        this.subscribes.forEach(sub => sub.unsubscribe());
    }


}
