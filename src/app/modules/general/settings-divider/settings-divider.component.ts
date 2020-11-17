import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-settings-divider',
  templateUrl: './settings-divider.component.html',
  styleUrls: ['./settings-divider.component.css']
})
export class SettingsDividerComponent implements OnInit {

    @Input() public context : any;
  
    constructor() { }

  ngOnInit(): void {
  }

}
