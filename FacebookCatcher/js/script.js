var dns = null;

(function(){
	chrome.runtime.sendMessage({type : 'Get_Basic_Data'}, function(data){
		$('#server-input').val(data.server);
		$('#server-status>span').text(data.lastMessage);
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