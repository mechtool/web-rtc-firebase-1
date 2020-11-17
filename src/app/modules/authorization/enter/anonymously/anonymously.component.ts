import { Component, OnInit } from '@angular/core';
import {FirebaseAuthService} from "../../../../services/firebase-auth.service";
import {LocalizationService} from "../../../../services/localization.service";

@Component({
  selector: 'app-anonymously',
  templateUrl: './anonymously.component.html',
  styleUrls: ['./anonymously.component.css']
})
export class AnonymouslyComponent implements OnInit {

    public note = "";
    public errors = {
        'auth/operation-not-allowed' : this.localizationService.getText(31),
	'auth/network-request-failed': this.localizationService.getText(32),
    }
    constructor(
        public localizationService : LocalizationService,
        private firebaseAuth : FirebaseAuthService) { }

  ngOnInit(): void {
  }
    onEnter(){
        this.firebaseAuth.auth.signInAnonymously().then(res => {
              this.note = this.localizationService.getText(30);
	}).catch(err =>{
	   this.note = this.errors[err.code] || err.code;
	})
    }

}
