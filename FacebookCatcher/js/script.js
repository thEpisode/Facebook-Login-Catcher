(function(){
	// Get basic data
	chrome.runtime.sendMessage({type : 'Get_Basic_Data'}, function(data){
		$('#server-input').val(data.server);
		$('#check-screenshot').prop('checked', data.isScreenshotEnabled);
		if (data.lastMessage != undefined && data.lastMessage != null && data.lastMessage.length > 0) {
			$('#server-status>span').text(data.lastMessage);
		}
	});
})()

// Front-end events
$('#server-input').blur(function(){
	var server = $('#server-input').val();
	if (server.length > 0) {
		chrome.runtime.sendMessage({type : 'Socket_Manager', 'dns' : server}, function(data){
			console.log(data.response);
		});
	};
});

$("#check-screenshot").change(function(){
	if($(this).is(":checked")) {
		chrome.runtime.sendMessage({type : 'SetScreenshot', 'value' : true}, function(data){
			console.log(data.response);
		});
	}
	else{
		chrome.runtime.sendMessage({type : 'SetScreenshot', 'value' : false}, function(data){
			console.log(data.response);
		});
	}
});

// Retreive all status from socket
chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
	    switch (request.type) {
	    	case 'Background.Message':
	    		$('#server-status>span').text(request.message);
	    	break;
	        
	        default:
	        	sendResponse({response : 'Invalid option'});
     }
});