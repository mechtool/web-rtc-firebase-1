import { Injectable } from '@angular/core';
import { environment} from "../../environments/environment.prod";
let firebase = require("firebase/app");
@Injectable({
  providedIn: 'root'
})
export class FirebaseService {
    public firebase;
    constructor() {
        this.firebase = firebase;
	firebase.initializeApp(environment.firebaseConfig);
    }
}
