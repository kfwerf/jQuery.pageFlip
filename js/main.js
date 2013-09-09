var myFlip;
;(function ($) {
	'use strict';

	var eDoc = $(document);
	var direction = 'right';

	myFlip = $('.myContent').pageFlip('.myContentTwo', { direction: direction, autostart: false, destroy: false });

	myFlip.pause();
	/*
		delete: function () 
		pause: function () 
		resume: function () 
		reverse: function () 
		seek: function (frame) 
		start: function () 
		startFrom: function (frame) 
	*/

// Controls

	$('a.start').click(function(e) {
		e.preventDefault();
		myFlip.start();
	});
	
	$('a.reverse').click(function(e) {
		e.preventDefault();
		myFlip.reverse();
	});
	
	$('a.pause').click(function(e) {
		e.preventDefault();
		myFlip.pause();
	});
	
	$('a.resume').click(function(e) {
		e.preventDefault();
		myFlip.resume();
	});
	
	$('a.delete').click(function(e) {
		e.preventDefault();
		myFlip.delete();
	});
	
// StartFrom
	$('a.startfrom').click(function(e) {
		e.preventDefault();
		var nFrame = $('input.startfrom').val();
		console.log(nFrame);
		myFlip.startFrom(nFrame);
	});
// Seek
	$('input.seek').change(function(e) {
		e.preventDefault();
		var nFrame = $('input.seek').val();
		console.log(nFrame);
		myFlip.seek(nFrame);
	});
	$('select.direction').change(function(e) {
		e.preventDefault();
		var sDirection = $('select.direction').val();
		console.log(sDirection);
		myFlip.changeDirection(sDirection);
	});


	//f.seek(50);
	
})(jQuery);