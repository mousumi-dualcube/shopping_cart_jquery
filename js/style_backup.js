$.ajaxSetup({
  cache:false
});
jQuery(document).ready( function($) {
	//localStorage.removeItem('roxx_cart_cookie');


	//shop part  

	var product_array  = '{ "0" : { "id" : 101, "name" : "Product 1", "image" : "http://placehold.it/100x100", "desc" : "Quis aute iure reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Lorem ipsum dolor sit amet.", "price" : 20, "category" : "dress"}, "1" : { "id" : 110, "name" : "Product 11", "image" : "http://placehold.it/100x100", "desc" : "Quis aute iure reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Lorem ipsum dolor sit amet.", "price" : 20, "category" : "dress"}, "2" : { "id" : 102, "name" : "Product 2", "image" : "http://placehold.it/100x100", "desc" : "Quis aute iure reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Lorem ipsum dolor sit amet.", "price" : 10, "category" : "shoe"}, "3" : { "id" : 103, "name" : "Product 4", "image" : "http://placehold.it/100x100", "desc" : "Quis aute iure reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Lorem ipsum dolor sit amet.", "price" : 20, "category" : "dress"}, "4" : { "id" : 104, "name" : "Product 5", "image" : "http://placehold.it/100x100", "desc" : "Quis aute iure reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Lorem ipsum dolor sit amet.", "price" : 10, "category" : "shoe" }, "5" : { "id" : 105, "name" : "Product 6", "image" : "http://placehold.it/100x100", "desc" : "Quis aute iure reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Lorem ipsum dolor sit amet.", "price" : 20, "category" : "dress"}, "6" : { "id" : 106, "name" : "Product 7", "image" : "http://placehold.it/100x100", "desc" : "Quis aute iure reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Lorem ipsum dolor sit amet.", "price" : 10, "category" : "shirt"}}';
	localStorage.setItem('product_array', product_array);
	var shop_object_items = jQuery.parseJSON(localStorage.getItem('product_array'));
	var url_cat = GetURLParameter('category');
	if(url_cat) {
		var sort_by = url_cat;
		$('.sort_by_category').val(sort_by);
	} else {
		var sort_by = $('.sort_by_category option:selected').val();
	}

	var shop_object_items = filter_item(shop_object_items, sort_by);
	set_shop_product(shop_object_items);

	function GetURLParameter(sParam) {
	    var sPageURL = window.location.search.substring(1);
	    var sURLVariables = sPageURL.split('&');
	    for (var i = 0; i < sURLVariables.length; i++) {
	        var sParameterName = sURLVariables[i].split('=');
	        if (sParameterName[0] == sParam) {
	            return decodeURIComponent(sParameterName[1]);
	        }
	    }
	}

	$('.sort_by_category').on('change', function() {
		var shop_object_items = jQuery.parseJSON(localStorage.getItem('product_array'));
		var sort_by = $('.sort_by_category option:selected').val();
		var shop_object_items = filter_item(shop_object_items, sort_by);
		set_shop_product(shop_object_items);
	});

	function filter_item(items, sort_by) {
		var shop_object_items = [];
		if(sort_by != 'all') {
			$.each(items, function(index, item_object) {
	  			if(item_object.category == sort_by) {
	  				 shop_object_items.push(item_object);
	  			}
			});
			return shop_object_items;
		} else {
			return items;
		}		
	}

	function set_shop_product(shop_object_items) {
		var shop_item = '';
		$.each(shop_object_items, function(index, shop_object) {
		  shop_item += '<section class="item_object col-md-3" data-pro_id="'+shop_object.id+'" ><a href="#" ><img width="200" height="200" src="'+ shop_object.image+'" class="" alt="green-retro-tv-2"><h3>'+ shop_object.name +'</h3><span class="shop_price"><span class="amount">$'+shop_object.price+'</span><input type="number" class="text-center shop_quantity_change" value="1"></a></span><a rel="nofollow" href="#" data-quantity="1" data-product_id="'+shop_object.id+'" class="btn btn-primary add_to_cart">Add to cart</a></section>';
		});
		$('.shop_html').html(shop_item);
	}
	$('.add_shop_items').on('click', '.add_to_cart', function(e) {
		e.preventDefault();
		if (typeof(Storage) !== "undefined") {
			var product_id = $(this).closest('section').attr('data-pro_id');
			var item_qty = $(this).closest('section').find('.shop_quantity_change').val();
			var get_product_array = jQuery.parseJSON(localStorage.getItem('product_array'));
			var product_obj = false;

			$.each(get_product_array, function(get_product_array_index, get_product) {
				if(product_id == get_product_array[get_product_array_index]['id']) {
					product_obj = get_product_array[get_product_array_index];
				}
			});

			if(product_obj) {
				if (localStorage.getItem("roxx_cart_cookie") === null) {
					var cart_object  = '{"'+product_id+'" : {"name" : "'+ product_obj.name +'", "image" : "'+ product_obj.image +'", "desc" : "'+product_obj.desc+'", "price" : "'+ product_obj.price * item_qty +'", "qty" : "'+ item_qty+'"}}';
					localStorage.setItem("roxx_cart_cookie", cart_object);
				} else {
					var cart_json_object = '';
					cart_json_object = localStorage.getItem("roxx_cart_cookie");
					var cart_object = '';
					cart_object = JSON.parse(cart_json_object);	
					$.each(cart_object , function(index, cart_object_item) {
						if(product_id == index) {
							var quantity = parseInt(cart_object[index]['qty']) + parseInt(item_qty);
							delete cart_object[product_id];
							cart_object[product_id] = {
								"name" : product_obj.name,
								"image" : product_obj.image,
								"desc" : product_obj.desc,
								"price" : product_obj.price,
								"qty" : quantity
							};
							localStorage.removeItem("roxx_cart_cookie");
							localStorage.setItem("roxx_cart_cookie", JSON.stringify(cart_object)); 	
						} 
					});
					cart_json_object = localStorage.getItem("roxx_cart_cookie");
					cart_objectt = JSON.parse(cart_json_object);
					var cart_object_keys = Object.keys(cart_objectt);
					if(cart_object_keys.indexOf(product_id) < 0 ) {
						cart_object[product_id] = {
							"name" : product_obj.name,
							"image" : product_obj.image,
							"desc" : product_obj.desc,
							"price" : product_obj.price,
							"qty" : item_qty
						};
						localStorage.removeItem("roxx_cart_cookie");
						localStorage.setItem("roxx_cart_cookie", JSON.stringify(cart_object)); 	
					}
				}				
				$('<div class="add_to_cart_text">Added to cart -> <a href="cart.html">View Cart</a></div>').insertAfter($(this));
			}
		} else {
			alert('Your browser does not support Local Storage.');
		}
	});






	// for cart 
		
	if (localStorage.getItem("roxx_cart_cookie") !== null) {
		var cart_object = jQuery.parseJSON(localStorage.getItem("roxx_cart_cookie")); 
		var item_html = '';
		if(cart_object !== null) {
			$.each(cart_object, function(index, cart_items) {
			  item_html += '<tr data-product_id="'+ index +'" ><td data-th="Product"><div class="row"><div class="col-sm-3 hidden-xs"><button class="btn btn-danger btn-sm cancel_product"><i class="fa fa-trash-o"></i></button><img class="cart_item_img" src="'+ cart_items.image +'"></div><div class="col-sm-9"><h4 class="nomargin">'+cart_items.name+'</h4><p>'+ cart_items.desc +'</p></div></div></td><td data-th="Price"><span class="product_price">$'+ cart_items.price +'</span></td><td data-th="Quantity"><input type="number" class="form-control text-center quantity_change" value='+ cart_items.qty +'></td><td data-th="Subtotal" class="text-center"><span class = "product_subtotal">$'+ (cart_items.price *  cart_items.qty) +'</span></td></tr>';
			});
		}

		item_html += '<tr><td><a href="shop.html" class="btn btn-warning continue_shopping"><i class="fa fa-angle-left"></i> Continue Shopping</a><input type="text" placeholder="Enter Coupon" class="coupon_textbox" value=""/><button type="button" class="btn btn-success coupon_apply">Apply Coupon</button></td><td></td><td class="text-center"><button type="button" class="btn btn-info cart_update">Update</button></td><td><a href="checkout.html" class="btn btn-primary btn-block">Checkout <i class="fa fa-angle-right"></i></a></td></tr>';
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
			window.location = 'shop.html';
		}
	}
});