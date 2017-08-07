jQuery(document).ready( function($) {	
	$('.jqans-pagination').css('min-height', $('.jqans-stories').height());
	$('.jqans-pagination').css('height', $('.jqans-stories').height());
});

(function( $ ){
	$.fn.accessNews = function(settings){
	
		var defaults = {
			// title for the display
			title: "",
			// subtitle for the display
			subtitle: "",
			// number of slides to advance when paginating
			slideBy: 8,
			// the speed for the pagination
			speed: "normal",
			// slideshow interval
			slideShowInterval: 5000,
			// delay before slide show begins
			slideShowDelay: 5000,
			// theme
			theme: "default",
			// allow the pagination to wrap continuously instead of stopping when the beginning or end is reached 
			continuousPaging : true,
			// selector for the story title
			contentTitle: "h3",
			// selector for the story subtitle
			contentSubTitle: "abbr",
			// selector for the story description
			contentDescription: "p",
			// function to call when the slider first initializes
			onLoad: null,
			// function to call when the slider is done being created
			onComplete: null
		};
		return this.each(function(){
			
			settings = jQuery.extend(defaults, settings);
			var _this = jQuery(this);
			var stories = _this.children();
			var intervalId;
			var _storyIndictor;
			var _storyIndictors;
			
			var container = {
				_wrapper: "<div class=\"jqans-wrapper " + settings.theme + "\"></div>",
				_container: "<div class=\"jqans-container\"></div>",
				_headline: jQuery("<div class='jqans-headline'></div>").html(["<p><strong>", settings.title, "</strong> ", settings.subtitle, "</p>"].join("")),
				_content: jQuery("<div class='jqans-content'></div>"),
				_stories: "<div class=\"jqans-stories col-md-10 col-sm-10 col-xs-12 hidden-xs\"></div>",
				_first: jQuery(stories[0]),
				
				init: function(){
				
					if (settings.onLoad)
					{
						settings.onLoad.call($(this));
					}
				
					// wrap the ul with our div class and assigned theme
					_this.wrap(this._wrapper);
					// our container where we show the image and news item
					_this.before(this._container);
					// set the width of the container
					var width = ((stories.length + 1 ) * this._first.outerWidth(true));
					_this.css("width", width);

					if (settings.title.length)
					{
						this.append(this._headline);
					}
					this.append(this._content);
					
					// create the selector indictor
					this.selector(width);
					
					this.set(0);
					
					// pagination setup
					pagination.init();
					
					// slideshow setup
					slideshow.init();
					
					_this.wrap(this._stories);
					
					if (settings.onComplete)
					{
						settings.onComplete.call($(this));
					}

				},
				
				selector: function(width){
					var s = "";
					for(var i = 1; i <= stories.length; i++){
						s += "<li><div/></li>";
					}
					var o = jQuery("<div class=\"jqans-stories-selector\"></div>");
					o.append("<ul>"+ s +"</ul>");
					_storyIndictor = jQuery(o.find("ul"));
					_storyIndictors = _storyIndictor.children();
					o.css("width", width);
					_this.before(o);
				},
				
				append: function(content){
					this.get().append(content);
				},
				
				// returns the main container
				get: function(){
					return _this.parents("div.jqans-wrapper").find('div.jqans-container');
				},
				
				set: function(position){
					var container = this.get();
					var story = jQuery(stories[position]);

					var storyIndictor = jQuery(_storyIndictors[position]);
					var _content = jQuery("div.jqans-content", container);
					var img = jQuery('<a>'+'<img class=\"largeimage"\>'+'</img>'+'</a>');
					var para = jQuery('<div class=\"description\"></div>');
					var title = jQuery(settings.contentTitle + " a", story).attr('title') || jQuery(settings.contentTitle, story).html();
					img.attr('href', jQuery('a', story).attr('longdesc') || jQuery('a', story).attr('href'));
					para.html("<p>" + jQuery(settings.contentDescription, story).html() + "</p>");
					_content.empty();
					_content.append(img);
					if ( $( window ).width() < 480 ) {						
						para.find("p").find("a").text(function(index, currentText) {
						    var text = currentText.substr(0, 87);
						    return text + '...';
						});						
					} 
					
					_content.append(para);
					
					var href_link;
					href_link = $('.jqans-container').find('.jqans-content').find('a').attr('href');
					//console.log(href_link);
					$('#pagination-col').attr('href', href_link);
					
					$('.largeimage').attr('src', jQuery('img', story).attr('longdesc') || jQuery('img', story).attr('src'));
					stories.removeClass('selected');
					story.addClass('selected');
					_storyIndictors.removeClass('selected');
					storyIndictor.addClass('selected');
				}
				
			};
			
			
			
			var slideshow = {
				
				init: function(){
					this.attach();
					this.off();
					intervalId = setTimeout(function(){
						slideshow.on();
					}, settings.slideShowDelay);
				},
				
				on: function(){
					this.off();
					intervalId = setInterval(function(){
						slideshow.slide();
					}, settings.slideShowInterval);
				},
				
				off: function(){
					clearInterval(intervalId);
				},
				
				slide: function(){
				
					//currently selected story
					var current = jQuery("li.selected", _this);
					// the next story 
					var next = current.next("li");
					// page number
					var page = 0;
					
					if (!next.length)
					{
						next = jQuery(stories[0]);
						page = 1;
					}
					
					var storyIndex = stories.index(next);
					$('.jqans-pagination-count-start').html(parseInt(storyIndex) + 1); 

					if (pagination.loaded) {
						
						var storyMod = (storyIndex) % settings.slideBy;
						
						if (storyMod === 0) {							
							page = (Math.ceil(storyIndex / settings.slideBy)) + 1;
							
						}
						
						if (page > 0) {
							pagination.to(page);
						}
					}
					
					container.set(storyIndex);
					
				},

				slide_prev: function(){
				
					//currently selected story
					var current = jQuery("li.selected", _this);

					// the next story 
					var prev = current.prev("li");

					// page number
					var page = pagination._currentPage;

					if (!prev.length) {
						
						prev = jQuery(stories[stories.length - 1]);

						var storyIndex = stories.index(prev);
						page = (Math.ceil((storyIndex + 1) / settings.slideBy));
					}

					var storyIndex = stories.index(prev);
					
					$('.jqans-pagination-count-start').html(parseInt(storyIndex)); 

					if (pagination.loaded) {

						var storyMod = (storyIndex + 1) % settings.slideBy;
						
						if (storyMod === 0) {
							page = (Math.ceil((storyIndex + 1) / settings.slideBy));
							
						}
						
						if(pagination._animating){
							return;
						}

						// we're animating! 
						pagination._animating = true;
				
						var viewAll = _this.parent("div").next(".jqans-pagination");
						var startAt = jQuery(".jqans-pagination-count-start", viewAll);
						var endAt = jQuery(".jqans-pagination-count-end", viewAll);
				
						if(page > pagination._totalPages) {
							page =  settings.continuousPaging ? 1 : pagination._totalPages;
						}
						
						if (page < 1) {
							page =  settings.continuousPaging ? pagination._totalPages : 1;
						}

						
						var _startAt = (page * settings.slideBy) - settings.slideBy;
						var _endAt = (page * settings.slideBy);
						if (_endAt > stories.length)
						{
							_endAt = stories.length;
						}

						var _left = parseInt(_this.css("left"));						

						var _offset = (page * pagination._slideByWidth) - pagination._slideByWidth; 

						startAt.html(storyIndex + 1);

						endAt.html(_endAt);						
						
						_left = (_offset * -1);
						
							
						_this.animate({
							left: _left
						}, settings.speed);
						
						_storyIndictor.animate({
							left: _left
						}, settings.speed);
				
						
						pagination._currentPage = page;
						
						// no more animating :(
						pagination._animating = false;
							
					}
					
					container.set(storyIndex);
				},
				
				attach: function(){
					
					var that = jQuery(_this).parent("div.jqans-wrapper");
					that.hover(function(){
						// pause the slideshow on hover
						slideshow.off();
					}, function (){
						// resume slideshow on mouseout
						slideshow.on();
					});
					
				}
				
			};

			var pagination = {
			
				loaded: false,
				_animating: false,
				_totalPages: 0,
				_currentPage: 1,
				_storyWidth: 0,
				_slideByWidth: 0,

				init: function(){
					if (stories.length > settings.slideBy) {
						this._totalPages = Math.ceil(stories.length / settings.slideBy);
						this._storyWidth = jQuery(stories[0]).outerWidth(true);
						this._slideByWidth = this._storyWidth * settings.slideBy;
						this.draw();
						this.loaded = true;
					}
				},
				
				draw: function(){
				
					var _viewAll = jQuery("<div class=\"jqans-pagination col-md-2 col-sm-2 col-xs-12 \" ></div>").html(["<div class=\"jqans-pagination-count\"><span class=\"jqans-pagination-count-start\">1</span> of <span class=\"jqans-pagination-count-total\">", stories.length, "</span></div>"].join(""));
					var _arrow_all = jQuery("<div class=\"jqans-pagination-controls\"></div>").html(["<div class=\"col-md-2 col-sm-2 col-xs-2\"><span class=\"jqans-pagination-controls-back\"><a href=\"#\" title=\"Previous\">&lt;&lt; Back</a></span></div><div class=\"col-md-8 col-sm-8 col-xs-8\"><a id=\"pagination-col\"></a></div><div class=\"col-md-2 col-sm-2 col-xs-2\"><span class=\"jqans-pagination-controls-next\"><a href=\"#\" title=\"Next\">Next &gt;&gt;</a></span></div>"].join(""));
					_this.after(_arrow_all);					
					_this.after(_viewAll);
					
					var href_link;
					href_link = $('.jqans-container').find('.jqans-content').find('a').attr('href');
					//console.log(href_link);
					$('#pagination-col').attr('href', href_link);
					
					$('.caraosel_layout').find('.jqans-pagination').css('min-height', $('.caraosel_layout').find('.jqans-stories').height());
					$('.caraosel_layout').find('.jqans-pagination').css('height', $('.caraosel_layout').find('.jqans-stories').height());
					var _next = jQuery(".jqans-pagination-controls-next > a", _arrow_all);
					var _back = jQuery(".jqans-pagination-controls-back > a", _arrow_all);
					
					_next.click(function(){
						
						var page = pagination._currentPage + 1;
						slideshow.slide();
						//pagination.to(page);
						return false;
						
					});
					
					_back.click(function(){
						
						var page = pagination._currentPage - 1;
						slideshow.slide_prev();
						//pagination.to(page);
						return false;
						
					});

					stories.click(function(){
						
						var page = pagination._currentPage;
						pagination.to(page);
						return false;
						
					});

				},
				
				to: function(page){

					if(this._animating){
						return;
					}
					
					// we're animating! 
					this._animating = true;
					
					var viewAll = _this.parent("div").next(".jqans-pagination");
					var startAt = jQuery(".jqans-pagination-count-start", viewAll);
					var endAt = jQuery(".jqans-pagination-count-end", viewAll);
					
					if(page > this._totalPages)
					{
						page =  settings.continuousPaging ? 1 : this._totalPages;
					}
					
					if (page < 1)
					{
						page =  settings.continuousPaging ? this._totalPages : 1;
					}

					var _startAt = (page * settings.slideBy) - settings.slideBy;
					var _endAt = (page * settings.slideBy);
					if (_endAt > stories.length)
					{
						_endAt = stories.length;
					}
					var _left = parseInt(_this.css("left"));
					var _offset = (page * this._slideByWidth) - this._slideByWidth; 
					startAt.html(_startAt + 1);
					endAt.html(_endAt);
					
					_left = (_offset * -1);
						
					_this.animate({
						left: _left
					}, settings.speed);
					
					_storyIndictor.animate({
						left: _left
					}, settings.speed);
					
					// when paginating set the active story to the first
					// story on the page
					
					container.set(_startAt);

					this._currentPage = page;
					
					// no more animating :(
					this._animating = false;
						
				}

			};
			
			//setup the container
			container.init();
			// append hover every to each element to update container content
			stories.on('click', function() {
				// set container contect to hovered li
				container.set(stories.index(this));
				var page = stories.index(this);
				$('.jqans-pagination-count-start').html(parseInt(page) + 1); 

			});

		});
	};
})( jQuery );


