$.ajaxSetup({
  cache:false
});
jQuery(document).ready( function($) {
	//checkout
	
	if (localStorage.getItem("roxx_cart_cookie") !== null) {
		var checkout_object = jQuery.parseJSON(localStorage.getItem("roxx_cart_cookie"));
		if(checkout_object !== null) {
			var item_html ='';
			var cart_subtotal = 0;
			var discount = 0;
			var cart_shipping = 0;
			var cart_total = 0;
			$.each(checkout_object, function(index, cart_items) {
			  item_html += '<tr data-product_id="'+ index +'" ><td data-th="Product"><label class="nomargin">'+cart_items.name+'</label> <span class="smaill_text"> X'+ cart_items.qty +'</span></td><td data-th="Subtotal" class="text-center"><span class = "product_subtotal price">$'+ (cart_items.price *  cart_items.qty) +'</span></td></tr>';
			  cart_subtotal = cart_subtotal + (parseFloat(cart_items.price) *  parseFloat(cart_items.qty));
			});
		}
		if (localStorage.getItem("coupon_added") !== null) {
      var already_applied = localStorage.getItem("coupon_added");
      already_applied = already_applied.split(":");
      discount = (cart_subtotal * parseInt(already_applied[1]))/100;
    }
		if(cart_subtotal > discount ) {
			cart_total = cart_subtotal + cart_shipping  - discount;
		} else {
			cart_total = cart_shipping;
			discount = discount - cart_subtotal;
		}		
		item_html += '<tr><td><label>Subtotal</label></td><td><span class="price">$'+cart_subtotal+'</span></td></tr>';
		if(discount > 0) item_html += '<tr><td><label>Discount</label></td><td><span class="price">$'+discount+'</span></td></tr>';
		item_html += '<tr><td><label>Shipping</label></td><td><span class="price">Free Shipping</span></td></tr><tr><td><label>Total</label></td><td><span class="price">$'+cart_total+'</span></td></tr>';
		item_html += '<tr><td class="" colspan=2><a href="order.html" class="btn btn-primary pull-right checkout_validation">Place Order</a></td></tr>',
		$('.checkout_order_item').html(item_html);
	}
	if($('.show_error').html() == '' ) {
		$('.show_error').css('display', 'none');
	}
  $('.checkout_order_item').on('click', '.checkout_validation', function(e){
  	var validation = false;
  	var show_error = '';
  	if(!$('.billing_first_name').val()) {
  		show_error += '<p><b>Billing first name</b> is required</p>';
  	}
  	if(!$('.billing_last_name').val()) {
  		show_error += '<p><b>Billing last name</b> is required</p>';
  	}
  	if(!$.trim($(".billing_address").val())) {
  		show_error += '<p><b>Billing address</b> is required</p>';
  	}
  	if(!$('.shipping_first_name').val()) {
  		show_error += '<p><b>Shiping last name</b> is required</p>';
  	}
  	if(!$('.shipping_last_name').val()) {
  		show_error += '<p><b>Shiping last name</b> is required</p>';
  	}
  	if(!$.trim($(".shipping_address").val())) {
  		show_error += '<p><b>Shiping address</b> is required</p>';
  	}
  	if(!$('.billing_email').val()) {
  		show_error += '<p><b>Billing email</b> is required</p>';
  	} else {
  		var pattern = /^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([ \t]*\r\n)?[ \t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([ \t]*\r\n)?[ \t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;
  		if(!pattern.test($('.billing_email').val()))	{
  			show_error += '<p><b>Enter valid email address</p>';
  		}
  	}
  	
  	if(show_error != '') {
  		e.preventDefault();
  		$('.show_error').html(show_error);
  		$('.show_error').css('display', 'block');  		
  	} else {
  		localStorage.removeItem("roxx_cart_cookie");
  		localStorage.removeItem("coupon_added");
  		window.location = "order.html";
  	}
  	
  });
});