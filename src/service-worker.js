importScripts('ngsw-worker.js');
let version = '1.0.1';
let channel = new BroadcastChannel('sw-messages');
channel.addEventListener('message', event => {
	if(event.data.type === 'version'){
		console.log('version : ' + version) ;
	}
});
//channel.postMessage({type : 'version', version : version});

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
