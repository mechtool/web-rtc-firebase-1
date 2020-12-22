import {
    AfterViewInit,
    ChangeDetectorRef,
    Component,
    ElementRef,
    EventEmitter,
    HostListener, Input,
    OnDestroy,
    Output,
    ViewChild
} from '@angular/core';
import {BehaviorSubject} from "rxjs";
import {AppContextState} from "../../../store/states";
import {Store} from "@ngxs/store";
import {Contact} from "../../../classes/Classes";
import { FirebaseDatabaseService } from 'src/app/services/firebase-database.service';
import { FirebaseStorageService } from 'src/app/services/firebase-storage.service';
import {LocalizationService} from "../../../services/localization.service";

@Component({
  selector: 'app-contact-icon-select',
  templateUrl: './contact-icon-select.component.html',
  styleUrls: ['./contact-icon-select.component.css']
})
export class ContactIconSelectComponent implements AfterViewInit, OnDestroy {
    
    public hasSniper = false;
    public subscriptions = [];
    public icons = [
	{icon : 'user', link : '/assets/icons/user.svg', listener : this.onCheckedIcon.bind(this), active : false} ,
	{icon : 'user1',link : '/assets/icons/user1.svg', listener : this.onCheckedIcon.bind(this), active : false} ,
	{icon : 'user2', link : '/assets/icons/user2.svg', listener : this.onCheckedIcon.bind(this), active : false} ,
    ];
    public colors = [
	{color : '#2e64d6', active : false}, {color :'#c14523', active : false},
	{color : '#49a680', active : false}, {color : '#d6a211', active : false},
	{color :'#bf5389', active : false}, {color :'#2e9630', active : false},
    ];
    public activeItem = new BehaviorSubject({color : this.colors[0].color , img : this.icons[0].icon});
    public activatedContact : Contact = this.store.selectSnapshot(AppContextState.activatedContacts)[0];
	
    @ViewChild('inputFile', {read : ElementRef}) public inputFile : ElementRef;
    @ViewChild('uploadForm', {read : ElementRef}) public uploadForm : ElementRef;
    @Input() public context : any;
    @Output() public selectIcon : EventEmitter<any> = new EventEmitter();
    
    @HostListener('window:click', ['$event']) onClickWindow(event){
        this.selectIcon.emit({type : false});
        event.stopPropagation();
    }
   
    constructor(
        public changeRef : ChangeDetectorRef,
	public store : Store,
	public localizationService : LocalizationService,
	public firebaseStorage : FirebaseStorageService,
	public firebaseDatabase : FirebaseDatabaseService,
	) { }
	
    ngOnDestroy(): void {
        this.subscriptions.forEach(sub => sub.unsubscribe());
    }
    
    ngAfterViewInit(): void {
        this.inputFile.nativeElement.addEventListener('change', this.onChangeFile.bind(this));
    }
    
    onCheckedIcon(prop){
      let val = this.activeItem.value;
      this.icons.forEach(icon => icon.active = false);
      prop.icon.active = true;
      val.img = prop.icon.icon;
      this.activeItem.next(val);
      prop.event.stopPropagation();
  }
  
  onStopEvent(event){
      event.stopPropagation();
  }
  
    checkDisabled(){
	return !(this.icons.some(elem => elem.active) && this.colors.some(elem => elem.active));
    }
  
    getFromFile(event){
	this.inputFile.nativeElement.click();
	event.stopPropagation();
    }
    onClickInput($event){
        $event.stopPropagation();
    }
    
    onClickButton(prop){
		prop.event.stopPropagation();
		//Запись адреса файла и цвета фона в базу данных
    let user = this.store.selectSnapshot(AppContextState.appUser);
		this.firebaseDatabase.database.ref(user.uid === this.activatedContact.uid ? `/users/${user.uid}` : `/contacts/${user.uid}/${this.activatedContact.uid}`).update({backColor :  this.colors.filter(c => c.active )[0].color, photoURL : this.icons.filter(c => c.active )[0].link});
    this.selectIcon.emit({type : false, sniper : true});
    }

    onChangeFile($event){
	const fileList: FileList = $event.target.files;
	this.hasSniper = !!fileList.length;
	this.changeRef.detectChanges();
	if (fileList.length > 0) {
		//Запись копии файла в хранилище файлов
		let ref = this.firebaseStorage.storage.ref(`${this.activatedContact.uid}/photoUrl`);
			ref.put(fileList[0]).then(()=>{
					//Получение внешней ссылки и её Запись
			    ref.getDownloadURL().then((url)=> {
				let user = this.store.selectSnapshot(AppContextState.appUser);
				this.firebaseDatabase.database.ref(user.uid === this.activatedContact.uid ? `/users/${user.uid}` : `/contacts/${user.uid}/${this.activatedContact.uid}`).update({photoURL : url});                         //Убрать индикатор загрузки
				this.hasSniper = false;
				this.selectIcon.emit({type : false, sniper : true});
			  }).catch(function(error) {
			  // A full list of error codes is available at
				// https://firebase.google.com/docs/storage/web/handle-errors
				switch (error.code) {
				  case 'storage/object-not-found':
					// File doesn't exist
					break;
			  
				  case 'storage/unauthorized':
					// User doesn't have permission to access the object
					break;
			  
				  case 'storage/canceled':
					// User canceled the upload
					break;
			  
				  case 'storage/unknown':
					// Unknown error occurred, inspect the server response
					break;
				}
			  });
		    }).catch(err => {
			    //Обработка ошибки выгрузки файла
		    });
			}
    }

    onCheckColor(prop){
	    let color = this.colors[prop.inx], val = this.activeItem.value;
	    this.colors.forEach(color => color.active = false);
	    val.color = color.color;
	    color.active = true;
	    this.activeItem.next(val);
	    this.changeRef.markForCheck();
	    prop.event.stopPropagation();
    }

}
