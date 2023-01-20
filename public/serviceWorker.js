self.addEventListener('push', (event) => {
	const payload = JSON.parse(event.data.text());
	event.waitUntil(
		// registration.showNotification('Lucky Me (추첨기)', {
		// 	body: '식사 추첨 시간입니다',
		// 	data: { link: payload.link },
		// });
	);
});
// 
self.addEventListener('notificationclick', (event) => {
	clients.openWindow(event.notification.data.link);
	// clients.openWindow(event.notification.data.link);
});
// serviceWorker 설치 완료시
self.addEventListener('install', () => {
	self.skipWaiting();
	console.log('installed~!');

});

// // urlB64ToUint8Array is a magic function that will encode the base64 public key
// // to Array buffer which is needed by the subscription option
// const urlB64ToUint8Array = (base64String) => {
//     const padding = '='.repeat((4 - (base64String.length % 4)) % 4)
//     const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/')
//     const rawData = atob(base64)
//     const outputArray = new Uint8Array(rawData.length)
//     for (let i = 0; i < rawData.length; ++i) {
//       outputArray[i] = rawData.charCodeAt(i)
//     }
//     return outputArray
// }

// // saveSubscription saves the subscription to the backend
// const saveSubscription = async subscription => {
//     const SERVER_URL = 'http://localhost:8080/'
//     const response = await fetch(SERVER_URL, {
//       method: 'post',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(subscription),
//     })
//     return response.json()
// }

// self.addEventListener('activate', async () => {
//     // This will be called only once when the service worker is activated.
//     try {
//         const applicationServerKey = urlB64ToUint8Array(
//             'BKIU0H3CcTPmXExzcfin6K6REUEJMeHl8JiJhzKVpMapR4M6XwzeR8kjRlrA1_QGGcEWA0c1NAj9JefA5QexAoI'
//         )
//         const options = { applicationServerKey, userVisibleOnly: true }
//         const subscription = await self.registration.pushManager.subscribe(options)
//         console.log(JSON.stringify(subscription))
//     } catch (err) {
//         console.log('Error', err)
//     }
// })
//Push Message 수신 이벤트
// self.addEventListener('push', function (event)
// {
//     console.log('[ServiceWorker] 푸시알림 수신: ', event);
 
//     //Push 정보 조회
//     var title = event.data.title || '알림';
//     var body = event.data.body;
//     var icon = event.data.icon || '/img/lucky-me-icon_120.png'; //512x512
//     var options = {
//         body: body,
//         icon: icon,
//     };
 
//     //Notification 출력
//     event.waitUntil(self.registration.showNotification(title, options));
// });
 
//사용자가 Notification을 클릭했을 때
self.addEventListener('notificationclick', function (event)
{
    console.log('[ServiceWorker] 푸시알림 클릭: ', event);
 
    event.notification.close();
    event.waitUntil(
        clients.matchAll({ type: "window" })
            .then(function (clientList) 
            {
                //실행된 브라우저가 있으면 Focus
                for (var i = 0; i < clientList.length; i++) 
                {
                    var client = clientList[i];
                    if (client.url == '/' && 'focus' in client)
                        return client.focus();
                }
                //실행된 브라우저가 없으면 Open
                if (clients.openWindow)
                    return clients.openWindow('https://www.naver.com/');
            })
    );
});
 
function displayNoti(title, msg) {
    const options = {
        body : message,
        icon : '/img/lucky-me-icon_120.png',
        // image : '/img/icons/android-icon-48x48.png',
        // dir : 'ltr',
        lang : 'ko-KR',
        // vibrate : [100, 50, 200],
        badge : '/img/lucky-me-icon_120.png',
        tag : 'roulette time notification',
        // renotify : true,
        // actions : [
            // { action : 'confirm', title : '확인하기', icon : '/img/icons/android-icon-48x48.png' },
            // { action : 'cancel', title : '취소', icon : '/img/icons/android-icon-48x48.png' },
        // ]
    }
}

// console.log('Started', self);
// self.addEventListener('install', function(event) {
//   self.skipWaiting();
//   console.log('Installed', event);
// });
// self.addEventListener('activate', function(event) {
//   console.log('Activated', event);
// });
// self.addEventListener('push', function(event) {
//   console.log('Push message', event);
//   var title = 'Push message';
//   event.waitUntil(
//     self.registration.showNotification(title, {
//       body: 'The Message',
//       icon: 'images/icon.png',
//       tag: 'my-tag'
//     }));
// });
// TODO