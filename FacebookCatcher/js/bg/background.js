(function(){
	console.log('Ready from background.js')
})()

chrome.runtime.onMessage.addListener(
	function(request, sender, sendResponse) {
	    switch (request.type) {
	         case 'on_form_submit':
	             var data = request.data;
	             
	             console.log(data);
	             sendResponse({response: 'Credentials sended'})
	             break;
	         default:
	         	sendResponse({response : 'Invalid option'});
     }
});