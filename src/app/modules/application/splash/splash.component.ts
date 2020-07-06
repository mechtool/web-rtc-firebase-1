import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.component.html',
  styleUrls: ['./splash.component.css']
})
export class SplashComponent implements OnInit {
    public buttonBlocks = [
	{className : 'button-contacts', icon : 'start-contacts',  badge : false, fragment : '0', area : 'Контакты'} ,
	{className : 'button-announcements', icon : 'start-announcements', badge : '1' , hiddenBadge : false,  fragment : '1', area : 'Уведомления'},
	{className : 'button-messages', icon : 'start-messages', badge : false,  fragment : '2', area : 'Сообщения'} ,
	{className : 'button-settings', icon : 'start-settings',  badge : false, fragment : '3', area : 'Настройки'} ,
    ];
  constructor() {
  }
  
  
  ngOnInit(): void {
  }

}
