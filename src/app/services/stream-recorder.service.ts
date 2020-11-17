import { Injectable } from '@angular/core';
import {FirebaseStorageService} from "./firebase-storage.service";
import {AppContextService} from "./app-context.service";
import {FirebaseDatabaseService} from "./firebase-database.service";
import {v4 as uuid} from 'uuid';
declare let MediaRecorder : any;

@Injectable({
  providedIn: 'root'
})
export class StreamRecorderService {

  constructor(
      public appContext : AppContextService,
      public database : FirebaseDatabaseService,
      public databaseStorage :FirebaseStorageService) { }
  
  startRecodeStream(options : {wid : string, uid : string, mediaRecorders : any, stream : MediaStream, local : boolean, messageUrl :string}){
      let recorderItem = options.mediaRecorders[options.uid] = {
          startTime : Date.now(),
	  recordedChunks : [],
	  stream : options.stream,
	  mediaRecorder : new MediaRecorder(options.stream, StreamRecorderService.getMediaRecorderOptions()),
      };
      recorderItem.mediaRecorder.ondataavailable = (event)=>{
	  if (event.data.size > 0) {
	      recorderItem.recordedChunks.push(event.data);
	  }
      } ;
      recorderItem.mediaRecorder.onstop = ()=>{
          //Окончательная остановка после последнего вызова ondataavailable
	 //Запись в Blob и передача на сервер
	  let blob =  new Blob(recorderItem.recordedChunks, {type: "video/webm"}),
	      storagePath = '/streams/'+ uuid() ;
	  this.databaseStorage.storage.ref(storagePath).put(blob).then(async res => {
	      let url = await this.databaseStorage.storage.ref(storagePath).getDownloadURL();
	      this.database.changeMessage(options.messageUrl + '/metadata/'+ options.uid,{wid : options.wid, uid : options.uid, local : options.local, startTime: recorderItem.startTime, storagePath: storagePath, downLoadedUrl : url, messageUrl : options.messageUrl});
	  }).catch(err => {}) ;
      };
      recorderItem.mediaRecorder.start();
  }
  
  static getMediaRecorderOptions() {
      return [
          { mimeType : ["video/webm"/*, "video/webm;codecs=vp8", "video/webm;codecs=daala", "video/webm;codecs=h264","video/mpeg"*/].filter(type => MediaRecorder.isTypeSupported(type))[0]}
          ][0];
  }
  

}
