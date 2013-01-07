$(document).ready(function(){

//swipe logic     
	var wrap = $('#guestApp'),
    slides = wrap.find('.screen'),
    active = slides.filter('.active'),
    i = slides.index(active),
    width = wrap.width();
    
    slides
    .on('swipeleft', function(e) {
    	if (i === slides.length - 1) { return; }
		slides.eq(i + 1).trigger('activate');
    })
    .on('swiperight', function(e) {
    	if (i === 0) { return; }
		slides.eq(i - 1).trigger('activate');
    })
    .on('activate', function(e) {
		slides.eq(i).removeClass('active');
		$(slides.eq(i)).hide(0,0,function(){
			$(e.target).addClass('active');
			$(e.target).fadeIn(300);
			// Update the active slide index
			i = slides.index(e.target);
		});
	})
	.on('movestart', function(e) {
		// If the movestart heads off in a upwards or downwards
		// direction, prevent it so that the browser scrolls normally.
		if ((e.distX > e.distY && e.distX < -e.distY) ||
		    (e.distX < e.distY && e.distX > -e.distY)) {
			e.preventDefault();
			return;
		}

		// To allow the slide to keep step with the finger,
		// temporarily disable transitions.
		wrap.addClass('notransition');
	})

	.on('move', function(e) {
		var left = 100 * e.distX / width;
		// Move slides with the finger
		if (e.distX < 0) {
			if (slides[i+1]) {
				slides[i].style.left = left + '%';
				slides[i+1].style.left = (left+100)+'%';
			}
			else {
				slides[i].style.left = left/4 + '%';
			}
		}
		if (e.distX > 0) {
			if (slides[i-1]) {
				slides[i].style.left = left + '%';
				slides[i-1].style.left = (left-100)+'%';
			}
			else {
				slides[i].style.left = left/5 + '%';
			}
		}
	})
	
	.on('moveend', function(e) {
		wrap.removeClass('notransition');
	
		slides[i].style.left = '';

		if (slides[i+1]) {
			slides[i+1].style.left = '';
		}
		if (slides[i-1]) {
			slides[i-1].style.left = '';
		}
	});
});