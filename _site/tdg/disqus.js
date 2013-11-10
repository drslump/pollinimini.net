// Create the namespace container and set some defaults
var DRDISQUS = {
	isEnabled 	: false,
	containerId	: 'comments',

	sortBy		: 'oldest'
};

// Bootstrap function to enable the Disqus commenting system
DRDISQUS.enable = function(){
	// Check if already ran
	if ( DRDISQUS.isEnabled ) {
		return;
	}
	DRDISQUS.isEnabled = true;

	if ( document.getElementById(DRDISQUS.containerId) ) {
		// Disable crappy ASP.NET wrapper form
		if (theForm) {
			theForm.submit = function(){ return false; }
			theForm.onsubmit = function(){ return false; }
		}
		
		DRDISQUS.injectComments();
	} else {
		DRDISQUS.updateCommentsCount();
	}
}

DRDISQUS.poolForContainer = function() {
	if ( DRDISQUS.isEnabled ) {
		return;
	}

	if ( document.getElementById(DRDISQUS.containerId) ) {
		DRDISQUS.enable();
		return;
	}

	setTimeout( DRDISQUS.poolForContainer, 0 );
}

DRDISQUS.injectComments = function() {

	var cont = document.createElement('DIV'),
	    old = document.getElementById( DRDISQUS.containerId );

	cont.id = 'disqus_thread';

	// Remove the comments node and replace with our new div
	old.parentNode.replaceChild( cont, old );


	// Normalize the url
	var url = window.location.href
	.replace(/[\?#].*$/, '')
	.replace(/\b[a-z\.]+\.terra\.es/i, 'comunidad.terra.es');

	// Create some Disqus globals
	window.discus_url = url;
	window.discus_date = new Date();
	window.disqus_container_id = 'dsq-content';

	// Build up the script tag to get the latest comments
	var script = document.createElement('SCRIPT');
	script.type = 'text/javascript';
	/*
	script.src = 'http://disqus.com/forums/thedigitalgarden/thread.js'
		+ '?url=' + encodeURIComponent(url)
		+ '&message='
		+ '&title='
		+ '&show_count=-1'
		+ '&sort=' + DRDISQUS.sortBy
		+ '&show_threshold=0'
		+ '&category_id='
		+ '&developer='
		+ '&ifrs='
		+ '&' + window.discus_date.getTime();
	*/
	script.async = true;
	script.src = 'http://thedigitalgarden.disqus.com/embed.js';

	// Create the content DIV and attach the script to the page
	var content = document.createElement('DIV');
	content.id = window.disqus_container_id;

	// Create a 'loading...' message to be shown while Disqus is loaded
	var p = document.createElement('P');
	p.style.background = "url(http://pollinimini.net/tdg/loading.gif) scroll no-repeat left center";
	p.style.padding = '1em 48px';
	p.style.fontWeight = 'bold';
	p.style.fontSize = '14pt';
	p.appendChild(document.createTextNode('CARGANDO COMENTARIOS... Un poco de paciencia ;)'));
	//content.appendChild(p);

	// Initialize the Disqus script
	content.appendChild( script );
	cont.appendChild( content );
}

DRDISQUS.updateCommentsCount = function() {

	var anchor, q = '', href, idx = 0;

	// Find the 10 first articles comments' link
	while ( anchor = document.getElementById('bp___ctl00___RecentPosts___postlist___EntryItems_ctl0'+idx+'_CommentsLink') ) {
		// Modify the original url to include the Disqus hash
		href = anchor.href
					.replace(/#.*$/, '')
					.replace(/\b[a-z\.]+\.terra\.es/i, 'comunidad.terra.es');
		anchor.href = href + '#disqus_thread'; 
		q += 'url' + idx + '=' + encodeURIComponent(href) + '&';
		idx++;
	}
	// If at least one link was found load the Disqus script
	if ( idx ) {
		var script = document.createElement('SCRIPT');
		script.type = 'text/javascript';
		script.src = 'http://disqus.com/forums/thedigitalgarden/get_num_replies.js?' + q;
		document.body.appendChild(script);
	}
}


// Register the load handlers to trigger the comments as soon as possible

// IE 6 and 7
if ( /*@cc_on!@*/false ) {
	try {
		document.write("<scr" + "ipt id=__ie_onload defer src=javascript:void(0)><\/scr" + "ipt>");
		var script = document.getElementById("__ie_onload");
		script.onreadystatechange = function() {
			if (this.readyState == "complete") {
				//DRDISQUS.enable();
			}
		};
	} catch(e) {
		//alert(e);
	}
// W3C compliant browsers (Firefox, Opera...)
} else if (document.addEventListener) {
	document.addEventListener( 'DOMContentLoaded', DRDISQUS.enable, false );
}

// Fail-over method (old Safaris among others)
window.onload = DRDISQUS.enable;

// Since we want to show the comments as fast as possible we'll do some continous
// pooling until the page is loaded and the enableDisqus function triggered
DRDISQUS.poolForContainer();
