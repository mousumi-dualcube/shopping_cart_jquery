jQuery(document).ready( function($) {
	//localStorage.removeItem('product_array');
	//shop part  
	
	var product_array  = '{ "0" : { "id" : 101, "name" : "Red Rose Print Cotton Dress", "image" : "images/dress1.jpg", "desc" : "Quis aute iure reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Lorem ipsum dolor sit amet.", "price" : 20, "category" : "dress"}, "1" : { "id" : 110, "name" : "Violet Print Cotton Dress", "image" : "images/dress2.jpg", "desc" : "Quis aute iure reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Lorem ipsum dolor sit amet.", "price" : 20, "category" : "dress"}, "2" : { "id" : 102, "name" : "Flower Prints Jane Shoe", "image" : "images/shoes1.jpg", "desc" : "Quis aute iure reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Lorem ipsum dolor sit amet.", "price" : 10, "category" : "shoe"}, "3" : { "id" : 103, "name" : "Yellow And White Floral Dress", "image" : "images/dress3.jpg", "desc" : "Quis aute iure reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Lorem ipsum dolor sit amet.", "price" : 20, "category" : "dress"}, "4" : { "id" : 104, "name" : "Royal Blue with Flower Embelished shoe", "image" : "images/shoes2.jpg", "desc" : "Quis aute iure reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Lorem ipsum dolor sit amet.", "price" : 10, "category" : "shoe" }, "5" : { "id" : 105, "name" : "Cheetah Prints Flower Yellow Dress", "image" : "images/dress4.jpg", "desc" : "Quis aute iure reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Lorem ipsum dolor sit amet.", "price" : 20, "category" : "dress"}, "6" : { "id" : 107, "name" : "Lion Printed 2 Piece Set", "image" : "images/shirt2.jpg", "desc" : "Quis aute iure reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Lorem ipsum dolor sit amet.", "price" : 10, "category" : "shirt"}, "7" : { "id" : 107, "name" : "Cute Red And White 2 Piece Set", "image" : "images/shirt1.jpg", "desc" : "Quis aute iure reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Lorem ipsum dolor sit amet.", "price" : 10, "category" : "shirt"}}';
	localStorage.setItem('product_array', product_array);
	var shop_object_items = jQuery.parseJSON(localStorage.getItem('product_array'));
	//console.log(shop_object_items);
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
		  shop_item += '<section class="item_object col-md-3 col-xs-12 col-sm-6" data-pro_id="'+shop_object.id+'" ><a href="#" ><img class="img-responsive" src="'+ shop_object.image+'" class="" alt="green-retro-tv-2"><h4>'+ shop_object.name +'</h4><span class="shop_price"><span class="amount">$'+shop_object.price+'</span><input type="number" class="text-center shop_quantity_change" value="1"></a></span><a rel="nofollow" href="#" data-quantity="1" data-product_id="'+shop_object.id+'" class="btn btn-primary add_to_cart">Add to cart</a></section>';
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
});
$.ajaxSetup({
  cache:false
});