import { Injectable } from '@angular/core';
import {FirebaseDatabaseService} from "./firebase-database.service";
import {Store} from "@ngxs/store";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class SmsService {
  constructor(
      public store : Store,
      public firebaseService : FirebaseDatabaseService) {}

      sendSms(offer){

     }

}
