var socket = null;
var server = null;
var attemptsToReconnect = 3;
var lastMessage = '';

(function(){
	console.log('Ready from background.js')
})();


chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
	    switch (request.type) {
	    	case 'Get_Basic_Data':
	    		sendResponse({server : server, lastMessage : lastMessage})
	    		break;
	    	case 'Socket_Manager':
	    		server = request.dns;	    		
				attemptsToReconnect = 3;

				console.log(server)
	    		socketManager();
	    	break;
	        case 'on_form_submit':
	            var data = request.data;
	             
	            console.log(socket);
	            sendResponse({response: 'Credentials sended'})
	            break;
	        default:
	        	sendResponse({response : 'Invalid option'});
     }
});

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
}