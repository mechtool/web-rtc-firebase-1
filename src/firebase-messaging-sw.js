"use strict";
importScripts('ngsw-worker.js');
importScripts('https://www.gstatic.com/firebasejs/7.15.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.15.0/firebase-messaging.js');
let version = '1.0.3';

firebase.initializeApp({
	"apiKey": "AIzaSyAxtqbBSC2MbX5RvwSIfFsJwlpEusQpPQE",
	"authDomain": "web-rtc-firebase-60109.firebaseapp.com",
	"databaseURL": "https://web-rtc-firebase-60109.firebaseio.com",
	"projectId": "web-rtc-firebase-60109",
	"storageBucket": "web-rtc-firebase-60109.appspot.com",
	"messagingSenderId": "38331819819",
	"appId": "1:38331819819:web:bc2f0bd28da7525f83876e",
	"measurementId": "G-9NCM2VVZKH"
});

const messaging = firebase.messaging();
messaging.setBackgroundMessageHandler(function(payload) {
	console.log('[firebase-messaging-sw.js] Received background message ', payload);
	// Customize notification here
	const notificationTitle = 'Background Message Title';
	const notificationOptions = {
		body: 'Background Message body.',
		icon: '/firebase-logo.png'
	};
	
	return self.registration.showNotification(notificationTitle,
		notificationOptions);
});
let channel = new BroadcastChannel('sw-messages');
channel.addEventListener('message', event => {
	if(event.data.type === 'version'){
		console.log('version : ' + version) ;
		channel.postMessage({type : 'version', version : version});
	}
});

/*self.addEventListener('push', (event)=> {
	const data = event.data.json();
	
	let title = data.notification.title +' от ' + data.user.uid,
		options = {
		/!*	actions : data.notification.actions,*!/
			body : data.notification.body,
		} ;
	event.waitUntil(self.registration.showNotification(title, options));
});*/

//Обработка событина нажатия пользователем на уведомление
self.addEventListener('notificationclick', (event )=> {
	//Обработка активности пользователя на текущем сообщении
	const rootUrl = new URL('/', location).href;
	event.notification.close();
	// Enumerate windows, and call window.focus(), or open a new one.
	if(event.action === 'accept' || event.action === ''){
		console.log('Сообщение принято.');
		event.waitUntil(async function() {
			const allClients = await self.clients.matchAll({
				includeUncontrolled: false
			});
			
			let currentClient;
			for (const client of allClients) {
				currentClient = client;
				if(!client.focused) {
					return client.focus();
				}
			}
			if (!currentClient) {
				return self.clients.openWindow(rootUrl); 
			}
		}())
	}
}) ;
