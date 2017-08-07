$.ajaxSetup({
  cache:false
});
jQuery(document).ready( function($) {
	//localStorage.removeItem('roxx_cart_cookie');
	
	// Resizing of divs according to height of the main content
	if ($(this).width() <= 992) {
		$('.sidebar_block').css('min-height', '420px');
		$('.sidebar_block').css('height', '420px');
	}
	if ($(this).width() >= 993 ) {
		var main_content_height = $('.main_content').height();
        var sidebar_height = $('.sidebar').height();
        $('.sidebar_block').css('min-height', $('.main_content').height());
        $('.sidebar_block').css('height', $('.main_content').height());        
	}

	$( window ).resize(function() {
		if ($(this).width() <= 992) {
			$('.sidebar_block').css('min-height', '420px');
			$('.sidebar_block').css('height', '420px');
		}
		if ($(this).width() >= 993 ) {
		 	var main_content_height = $('.main_content').height();
            var sidebar_height = $('.sidebar').height();
           	$('.sidebar_block').css('min-height', $('.main_content').height());
            $('.sidebar_block').css('height', $('.main_content').height());
        }
	});

	$( window ).load(function() {
		if ($(this).width() <= 992) {
			$('.sidebar_block').css('min-height', '420px');
			$('.sidebar_block').css('height', '420px');
		}
		if ($(this).width() >= 993 ) {
			var main_content_height = $('.main_content').height();
			var sidebar_height = $('.sidebar').height();
			$('.sidebar_block').css('min-height', $('.main_content').height());
			$('.sidebar_block').css('height', $('.main_content').height());    
		}
	});		
	
	if (localStorage.getItem("roxx_cart_cookie") == null) {
		var current_url = String(window.location);
		var cuurent_page = current_url.split('/');
		cuurent_page = cuurent_page[cuurent_page.length - 1];
		if(cuurent_page == 'cart.html') {
			window.location = 'empty_cart.html';
		}
		if(cuurent_page == 'checkout.html') {
			window.location = 'empty_cart.html';
		}
	}
});