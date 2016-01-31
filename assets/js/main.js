jQuery(document).ready(function(){
	var windowWidth=jQuery(window).width();

	if (windowWidth > 768) {
		var pages = $(".cd-section").length,
		scrolling = false,
		curPage = 1;

		function pagination(page, movingUp) {
			scrolling = true;
			var diff = curPage - page,
			oldPage = curPage;
			curPage = page;
			$(".cd-section").removeClass("active small previous");
			$(".page-" + page).addClass("active");
			$(".nav-btn").removeClass("active");
			$(".nav-page" + page).addClass("active");
			if (page > 1) {
				$(".page-" + (page - 1)).addClass("previous");
				if (movingUp) {
					$(".page-" + (page - 1)).hide();
					var hackPage = page;
					setTimeout(function() {
						$(".page-" + (hackPage - 1)).show();
					}, 600);
				}
				while (--page) {
					$(".page-" + page).addClass("small");
				}
			}
    //console.log(diff)
    if (diff > 1) {
    	for (var j = page + 1; j < oldPage; j++) {
    		$(".page-" + j + " .cd-half-block").css("transition", "transform .7s ease-out");
    	}
    }
    setTimeout(function() {
    	scrolling = false;
    	$(".cd-section .cd-half-block").attr("style", "");
    	$(".cd-section")
    }, 700);
}

function navigateUp() {
	if (curPage > 1) {
		curPage--;
		pagination(curPage, true);
	}
}

function navigateDown() {
	if (curPage < pages) {
		curPage++;
		pagination(curPage);
	}
}

$(document).on("mousewheel DOMMouseScroll", function(e) {
	if (!scrolling) {
		if (e.originalEvent.wheelDelta > 0 || e.originalEvent.detail < 0) {
			navigateUp();
		} else { 
			navigateDown();
		}
	}
});

$(document).on("click", ".scroll-btn", function() {
	if (scrolling) return;
	if ($(this).hasClass("up")) {
		navigateUp();
	} else {
		navigateDown();
	}
});

$(document).on("keydown", function(e) {
	if (scrolling) return;
	if (e.which === 38) {
		navigateUp();
	} else if (e.which === 40) {
		navigateDown();
	}
});

$(document).on("click", ".nav-btn:not(.active)", function() {
	if (scrolling) return;
	$(".overlay").removeClass('open');
	pagination(+$(this).attr("data-target"));
});

}



});



/*----------- Animated Headlines --------------*/

	//set animation timing
	var animationDelay = 2500,
		//loading bar effect
		barAnimationDelay = 3800,
		barWaiting = barAnimationDelay - 3000, //3000 is the duration of the transition on the loading bar - set in the scss/css file
		//letters effect
		lettersDelay = 50,
		//type effect
		typeLettersDelay = 150,
		selectionDuration = 500,
		typeAnimationDelay = selectionDuration + 800,
		//clip effect 
		revealDuration = 600,
		revealAnimationDelay = 1500;
		
		initHeadline();
		

		function initHeadline() {
		//insert <i> element for each letter of a changing word
		singleLetters($('.cd-headline.letters').find('b'));
		//initialise headline animation
		animateHeadline($('.cd-headline'));
	}

	function singleLetters($words) {
		$words.each(function(){
			var word = $(this),
			letters = word.text().split(''),
			selected = word.hasClass('is-visible');
			for (i in letters) {
				if(word.parents('.rotate-2').length > 0) letters[i] = '<em>' + letters[i] + '</em>';
				letters[i] = (selected) ? '<i class="in">' + letters[i] + '</i>': '<i>' + letters[i] + '</i>';
			}
			var newLetters = letters.join('');
			word.html(newLetters).css('opacity', 1);
		});
	}

	function animateHeadline($headlines) {
		var duration = animationDelay;
		$headlines.each(function(){
			var headline = $(this);
			
			if(headline.hasClass('loading-bar')) {
				duration = barAnimationDelay;
				setTimeout(function(){ headline.find('.cd-words-wrapper').addClass('is-loading') }, barWaiting);
			} else if (headline.hasClass('clip')){
				var spanWrapper = headline.find('.cd-words-wrapper'),
				newWidth = spanWrapper.width() + 10
				spanWrapper.css('width', newWidth);
			} else if (!headline.hasClass('type') ) {
				//assign to .cd-words-wrapper the width of its longest word
				var words = headline.find('.cd-words-wrapper b'),
				width = 0;
				words.each(function(){
					var wordWidth = $(this).width();
					if (wordWidth > width) width = wordWidth;
				});
				headline.find('.cd-words-wrapper').css('width', width);
			};

			//trigger animation
			setTimeout(function(){ hideWord( headline.find('.is-visible').eq(0) ) }, duration);
		});
	}

	function hideWord($word) {
		var nextWord = takeNext($word);
		
		if($word.parents('.cd-headline').hasClass('type')) {
			var parentSpan = $word.parent('.cd-words-wrapper');
			parentSpan.addClass('selected').removeClass('waiting');	
			setTimeout(function(){ 
				parentSpan.removeClass('selected'); 
				$word.removeClass('is-visible').addClass('is-hidden').children('i').removeClass('in').addClass('out');
			}, selectionDuration);
			setTimeout(function(){ showWord(nextWord, typeLettersDelay) }, typeAnimationDelay);
			
		} else if($word.parents('.cd-headline').hasClass('letters')) {
			var bool = ($word.children('i').length >= nextWord.children('i').length) ? true : false;
			hideLetter($word.find('i').eq(0), $word, bool, lettersDelay);
			showLetter(nextWord.find('i').eq(0), nextWord, bool, lettersDelay);

		}  else if($word.parents('.cd-headline').hasClass('clip')) {
			$word.parents('.cd-words-wrapper').animate({ width : '2px' }, revealDuration, function(){
				switchWord($word, nextWord);
				showWord(nextWord);
			});

		} else if ($word.parents('.cd-headline').hasClass('loading-bar')){
			$word.parents('.cd-words-wrapper').removeClass('is-loading');
			switchWord($word, nextWord);
			setTimeout(function(){ hideWord(nextWord) }, barAnimationDelay);
			setTimeout(function(){ $word.parents('.cd-words-wrapper').addClass('is-loading') }, barWaiting);

		} else {
			switchWord($word, nextWord);
			setTimeout(function(){ hideWord(nextWord) }, animationDelay);
		}
	}

	function showWord($word, $duration) {
		if($word.parents('.cd-headline').hasClass('type')) {
			showLetter($word.find('i').eq(0), $word, false, $duration);
			$word.addClass('is-visible').removeClass('is-hidden');

		}  else if($word.parents('.cd-headline').hasClass('clip')) {
			$word.parents('.cd-words-wrapper').animate({ 'width' : $word.width() + 10 }, revealDuration, function(){ 
				setTimeout(function(){ hideWord($word) }, revealAnimationDelay); 
			});
		}
	}

	function hideLetter($letter, $word, $bool, $duration) {
		$letter.removeClass('in').addClass('out');
		
		if(!$letter.is(':last-child')) {
			setTimeout(function(){ hideLetter($letter.next(), $word, $bool, $duration); }, $duration);  
		} else if($bool) { 
			setTimeout(function(){ hideWord(takeNext($word)) }, animationDelay);
		}

		if($letter.is(':last-child') && $('html').hasClass('no-csstransitions')) {
			var nextWord = takeNext($word);
			switchWord($word, nextWord);
		} 
	}

	function showLetter($letter, $word, $bool, $duration) {
		$letter.addClass('in').removeClass('out');
		
		if(!$letter.is(':last-child')) { 
			setTimeout(function(){ showLetter($letter.next(), $word, $bool, $duration); }, $duration); 
		} else { 
			if($word.parents('.cd-headline').hasClass('type')) { setTimeout(function(){ $word.parents('.cd-words-wrapper').addClass('waiting'); }, 200);}
			if(!$bool) { setTimeout(function(){ hideWord($word) }, animationDelay) }
		}
}

function takeNext($word) {
	return (!$word.is(':last-child')) ? $word.next() : $word.parent().children().eq(0);
}

function takePrev($word) {
	return (!$word.is(':first-child')) ? $word.prev() : $word.parent().children().last();
}

function switchWord($oldWord, $newWord) {
	$oldWord.removeClass('is-visible').addClass('is-hidden');
	$newWord.removeClass('is-hidden').addClass('is-visible');
}





/*-------------------------- Portfolio Item Filter -----------------------*/
$(function(){
	var $portfolio = $('#portfolio-item'),
	colWidth = function () {
		var w = $portfolio.width(), 
		columnNum = 1,
		columnWidth = 0;
		if (w > 960) {
			columnNum  = 4;
		} 
		else if (w > 768) {
			columnNum  = 3;
		}   
		else if (w > 640) {
			columnNum  = 3;
		}
		else if (w > 600) {
			columnNum  = 2;
		} 
		else if (w > 480) {
			columnNum  = 1;
		}  
		else if (w > 360) {
			columnNum  = 1;
		} 
		columnWidth = Math.floor(w/columnNum);
		$portfolio.find('.item').each(function() {
			var $item = $(this),
			multiplier_w = $item.attr('class').match(/item-w(\d)/),
			multiplier_h = $item.attr('class').match(/item-h(\d)/),
			width = multiplier_w ? columnWidth*multiplier_w[1] : columnWidth,
			height = multiplier_h ? columnWidth*multiplier_h[1]*0.7-10 : columnWidth*0.6-10;
			$item.css({
				width: width,
				height: height
			});
		});
		return columnWidth;
	},
	isotope = function () {
		$portfolio.isotope({
			resizable: true,
			itemSelector: '.item',
			masonry: {
				columnWidth: colWidth(),
				gutterWidth: 10
			}
		});
	};
	isotope();
	$(window).smartresize(isotope);
	
	$('#portfolio-item').isotope({ filter: '.cat-1' });
	
	$('.portfolioFilter a').click(function(){
		$('.portfolioFilter .current').removeClass('current');
		$(this).addClass('current');

		var selector = $(this).attr('data-filter');
		$portfolio.isotope({
			filter: selector,
			animationOptions: {
				duration: 750,
				easing: 'linear',
				queue: false
			}
		});
		return false;
	}); 


});






(function() {
	var triggerBttn = document.getElementById( 'trigger-overlay' ),
	overlay = document.querySelector( 'div.overlay' ),
	closeBttn = overlay.querySelector( 'button.overlay-close' );
	transEndEventNames = {
		'WebkitTransition': 'webkitTransitionEnd',
		'MozTransition': 'transitionend',
		'OTransition': 'oTransitionEnd',
		'msTransition': 'MSTransitionEnd',
		'transition': 'transitionend'
	},
	transEndEventName = transEndEventNames[ Modernizr.prefixed( 'transition' ) ],
	support = { transitions : Modernizr.csstransitions };
	s = Snap( overlay.querySelector( 'svg' ) ), 
	path = s.select( 'path' ),
	steps = overlay.getAttribute( 'data-steps' ).split(';'),
	stepsTotal = steps.length;

	function toggleOverlay() {
		if( classie.has( overlay, 'open' ) ) {
			var pos = stepsTotal-1;
			classie.remove( overlay, 'open' );
			classie.add( overlay, 'close' );
			
			var onEndTransitionFn = function( ev ) {
				classie.remove( overlay, 'close' );
			},
			nextStep = function( pos ) {
				pos--;
				if( pos < 0 ) return;
				path.animate( { 'path' : steps[pos] }, 60, mina.linear, function() { 
					if( pos === 0 ) {
						onEndTransitionFn();
					}
					nextStep(pos);
				} );
			};

			nextStep(pos);
		}
		else if( !classie.has( overlay, 'close' ) ) {
			var pos = 0;
			classie.add( overlay, 'open' );
			
			var nextStep = function( pos ) {
				pos++;
				if( pos > stepsTotal - 1 ) return;
				path.animate( { 'path' : steps[pos] }, 60, mina.linear, function() { nextStep(pos); } );
			};

			nextStep(pos);
		}
	}

	triggerBttn.addEventListener( 'click', toggleOverlay );
	closeBttn.addEventListener( 'click', toggleOverlay );


})();


