// Variables
var dnsServer = null;
var socket = null;
var attemptsToReconnect = 3;

function socketManager(){
	// Socket.io settings
	socket = new io(dnsServer);

	// Socket.io events
	socket.on('connect', function(data){
		$('#server-status>span').text('Connected to server');
		console.log('connected')
	});

	socket.on('connect_error', function(){
		console.log('Connect error to server');
		if (attemptsToReconnect <= 1) {
			socket.close();
			$('#server-status').text('Max of attempts to connect, verify if backend app is running');
		};
		attemptsToReconnect--;
	});
}


// Front-end events
$('#server-input').blur(function(){
	var server = $('#server-input').val();
	if (server.length > 0) {
		dnsServer = server;
		attemptsToReconnect = 3;
		socketManager();
	};
});