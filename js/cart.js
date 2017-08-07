$.ajaxSetup({
  cache:false
});
jQuery(document).ready( function($) {
	// for cart 
		
	if (localStorage.getItem("roxx_cart_cookie") !== null) {
		var cart_object = jQuery.parseJSON(localStorage.getItem("roxx_cart_cookie")); 
		var item_html = '';
		if(cart_object !== null) {
			$.each(cart_object, function(index, cart_items) {
			  item_html += '<tr data-product_id="'+ index +'" ><td data-th="Product"><div class="row"><div class="col-sm-3 hidden-xs"><button class="btn btn-danger btn-sm cancel_product"><i class="fa fa-trash-o"></i></button><img class="cart_item_img" src="'+ cart_items.image +'"></div><div class="col-sm-9"><h4 class="nomargin">'+cart_items.name+'</h4><p>'+ cart_items.desc +'</p></div></div></td><td data-th="Price"><span class="hidden-sm hidden-md hidden-lg">Price</span><span class="product_price">$'+ cart_items.price +'</span></td><td data-th="Quantity"><span class="hidden-sm hidden-md hidden-lg">Quantity</span><input type="number" class="form-control text-center quantity_change" value='+ cart_items.qty +'></td><td data-th="Subtotal" class="text-center"><span class="hidden-sm hidden-md hidden-lg">Total><span class = "product_subtotal">$'+ (cart_items.price *  cart_items.qty) +'</span></td></tr>';
			});
		}

		item_html += '<tr class="button_tr"><td><a href="shop.html" class="btn btn-warning continue_shopping"><i class="fa fa-angle-left"></i> Continue Shopping</a><input type="text" placeholder="Enter Coupon" class="coupon_textbox" value=""/><button type="button" class="btn btn-success coupon_apply">Apply Coupon</button></td><td></td><td class="text-center"><button type="button" class="btn btn-info cart_update">Update</button></td><td><a href="checkout.html" class="btn btn-primary btn-block">Checkout <i class="fa fa-angle-right"></i></a></td></tr>';
		calculate_cart(cart_object);
	}
	$('.cart_table_body').html(item_html);
	
	function calculate_cart(cart_items_val) {
		var cart_subtotal = 0;
		var cart_shipping = 0;
		var cart_total = 0;
		$.each(cart_items_val, function(cart_index, cart_items) {
				cart_subtotal = cart_subtotal + (parseFloat(cart_items.price) *  parseFloat(cart_items.qty));
		});
		var discount = 0;
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
		$('.cart-discount').remove();
		if(discount > 0 ) $('<tr class="cart-discount"><th>Discount</th><td data-title="discount"><span class="amount cart_discount_span">$'+ discount +' &nbsp;&nbsp;&nbsp;</span><a class="remove_coupon">Remove</a></td></tr>').insertAfter('.cart-subtotal');
		$('.cart_subtotal').text('$' + cart_subtotal);   
		$('.cart_total').text('$' + cart_total);
	}
	
	$('.cart_update').on('click', function(e) {
		var cart_subtotal = 0;
		var cart_object = jQuery.parseJSON(localStorage.getItem("roxx_cart_cookie")); 
		if(cart_object !== null) {
			$('.cart_table_body  > tr').each(function() {
				var product_id = $(this).attr('data-product_id');
				if(product_id) {
					var product_price = cart_object[product_id]['price'];
					var product_qty = $(this).find('td .quantity_change').val();
					var product_subtotal = product_price * product_qty;
					$(this).find('.product_subtotal').text('$' + product_subtotal);
					if (localStorage.getItem("roxx_cart_cookie") !== null) {				
						$.each(cart_object, function(cart_object_index, cart_items) {
								cart_object[product_id]['qty']= product_qty;
						});	
					}
				}
			});
			localStorage.setItem("roxx_cart_cookie", JSON.stringify(cart_object)); 	
			calculate_cart(jQuery.parseJSON(localStorage.getItem("roxx_cart_cookie"))); 	
		}		
	});
	
	$('.cancel_product').on('click', function() {
		var product_id = $(this).closest('tr').attr('data-product_id');
		cart_object = localStorage.getItem("roxx_cart_cookie");
		var cart_object = jQuery.parseJSON(cart_object);
		delete cart_object[product_id];
		if (jQuery.isEmptyObject(cart_object)) {
			localStorage.removeItem('roxx_cart_cookie');
		} else 	localStorage.setItem("roxx_cart_cookie", JSON.stringify(cart_object)); 
		window.location = window.location;
	});
	
	$('.calculate_cart').on('click', '.remove_coupon', function(e) {
			localStorage.removeItem('coupon_added');
			$('.cart-discount').remove();
			window.location = window.location; 
	});
	
	$('.coupon_apply').on('click', function(e) {
			var coupon_arr  = '{ "UPTO20" : { "off_percentage" : "20" }, "FLAT50" : { "off_percentage" : "50"}}';
			var coupon_arr = $.parseJSON(coupon_arr); 
			var coupon_code = $('.coupon_textbox').val();
			var valid_coupon = false;
			$.each(coupon_arr, function(coupon_arr_index, coupon_arr_items) {
				if(coupon_arr_index == coupon_code ) {
					valid_coupon = true;					
				}
      });
      		
      if(valid_coupon) {			
      	if (localStorage.getItem("coupon_added") !== null) {
      		var already_applied = localStorage.getItem("coupon_added");
      		already_applied = already_applied.split(":");
      		if(coupon_code == already_applied[0] ) {
      			alert('Already applied');
      			return 0;
      		}else {
      			alert('Apply one coupon at a time. Remove the previous and try again !');
      		}
      	}
				var cart_total = 0;
				var cart_subtotal = 0;
				var cart_shipping = 0;
				var cart_object = jQuery.parseJSON(localStorage.getItem("roxx_cart_cookie")); 
				$.each(cart_object, function(cart_indelx, cart_items) {
					cart_subtotal = cart_subtotal + (parseFloat(cart_items.price) *  parseFloat(cart_items.qty));
				});
				var discount = (cart_subtotal * parseInt(coupon_arr[coupon_code]['off_percentage']))/100;
				if(cart_subtotal > discount ) {
					cart_total = cart_subtotal + cart_shipping  - discount;
				} else {
					cart_total = cart_shipping;
					discount = discount - cart_subtotal;
				}
				localStorage.removeItem('coupon_added');
				localStorage.setItem("coupon_added", coupon_code + ':' + coupon_arr[coupon_code]['off_percentage']); 
				$('<tr class="cart-discount"><th>Discount</th><td data-title="discount"><span class="amount cart_discount_span">$'+ discount +' &nbsp;&nbsp;&nbsp;</span><a class="remove_coupon">Remove</a></td></tr>').insertAfter('.cart-subtotal');
				$('.cart_subtotal').text('$' + cart_subtotal);   
				$('.cart_total').text('$' + cart_total);
				alert('Coupon applied successfully.');
			} else {
				alert('Invalid Coupon code.');
			}
	});
});