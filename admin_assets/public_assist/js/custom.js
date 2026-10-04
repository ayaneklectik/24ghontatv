$(document).ready(function(){
	"use strict";

	/***** Preloader *****/
	$(window).on('load', function() {
		$(".preloader .item-wrapper").delay(1000).animate({
	        top: "-100%"
	    },1000,"easeInQuart");
	    $(".preloader").delay(1000).fadeOut(1000);
	});

	/***** Mobile Menu *****/
	$('nav#dropdown').meanmenu({
		meanScreenWidth: "767"
	});

	/***** Clock *****/
    function displayTime() {
        var currentTime = new Date();
        var hours = currentTime.getHours();
        var minutes = currentTime.getMinutes();
        var seconds = currentTime.getSeconds();
        var meridiem = "AM";

        if (hours > 12) {
            hours = hours - 12;
            meridiem = "PM";
        }
        if (hours === 0) {
            hours = 12;
        }
        if(hours < 10) {
            hours = "0" + hours;
        }
        if(minutes < 10) {
            minutes = "0" + minutes;
        }
        if(seconds < 10) {
            seconds = "0" + seconds;
        }

        var clockDiv = document.getElementById('dg-clock');
        clockDiv.innerText = hours + ":" + minutes + ":" + seconds + " " + meridiem;
    }

    displayTime();
    setInterval(displayTime, 1000);

	/***** Web Ticker *****/
	$('#webTicker').webTicker({
		height: '35px',
		speed: '40',
		duplicate: true,
		startEmpty:false
	});

	/***** Owl Carousel *****/
	$(".owl-slider").owlCarousel({
		autoplay:true,
		animateOut: 'fadeOut',
    	autoplayTimeout:4000,
    	autoplayHoverPause:true,
    	smartSpeed:500,
		loop: true,
		items : 1,
		margin: 0,
		responsiveClass: true,
		nav : true,
		navText: ['<i class="fa fa-angle-left"></i>', '<i class="fa fa-angle-right"></i>'],
		dots: false,
		responsive: {
			0: {
				items: 1
			},
			480: {
				items: 1
			},
			768: {
				items: 1
			},
			992: {
				items: 1
			}
		}
    });

	$(".popular-slider").owlCarousel({
		autoplay:false,
		animateOut: 'fadeOut',
    	autoplayTimeout:4000,
    	autoplayHoverPause:true,
    	smartSpeed:500,
		loop: true,
		items : 1,
		margin: 0,
		responsiveClass: true,
		dots: false,
		nav : true,
		navText: ['<i class="fa fa-angle-left"></i>', '<i class="fa fa-angle-right"></i>'],
		responsive: {
			0: {
				items: 1
			},
			480: {
				items: 1
			},
			768: {
				items: 1
			},
			992: {
				items: 1
			}
		}
    });

	$(".gallery-slider").owlCarousel({
		autoplay:true,
		
    	autoplayTimeout:3000,
    	autoplayHoverPause:true,
    	smartSpeed:500,
		loop: true,
		items : 1,
		margin: 0,
		responsiveClass: true,
		dots: false,
		nav : true,
		navText: ['<i class="fa fa-angle-left"></i>', '<i class="fa fa-angle-right"></i>'],
		responsive: {
			0: {
				items: 1
			},
			480: {
				items: 1
			},
			768: {
				items: 1
			},
			992: {
				items: 1
			}
		}
    });

	$(".int-slider").owlCarousel({
		autoplay:false,
		animateOut: 'fadeOut',
    	autoplayTimeout:4000,
    	autoplayHoverPause:true,
    	smartSpeed:500,
		loop: true,
		items : 1,
		margin: 0,
		responsiveClass: true,
		dots: false,
		nav : true,
		navText: ['<i class="fa fa-angle-left"></i>', '<i class="fa fa-angle-right"></i>'],
		responsive: {
			0: {
				items: 1
			},
			480: {
				items: 1
			},
			768: {
				items: 1
			},
			992: {
				items: 1
			}
		}
    });

	$(".more-slider").owlCarousel({
		autoplay:false,
		animateOut: 'fadeOut',
    	autoplayTimeout:4000,
    	autoplayHoverPause:true,
    	smartSpeed:500,
		loop: true,
		items : 1,
		margin: 0,
		responsiveClass: true,
		dots: false,
		nav : true,
		navText: ['<i class="fa fa-angle-left"></i>', '<i class="fa fa-angle-right"></i>'],
		responsive: {
			0: {
				items: 1
			},
			480: {
				items: 1
			},
			768: {
				items: 1
			},
			992: {
				items: 1
			}
		}
    });

	$(".mv-slider").owlCarousel({
		autoplay:false,
		animateOut: 'fadeOut',
    	autoplayTimeout:4000,
    	autoplayHoverPause:true,
    	smartSpeed:500,
		loop: true,
		items : 1,
		margin: 0,
		responsiveClass: true,
		dots: false,
		nav : true,
		navText: ['<i class="fa fa-angle-left"></i>', '<i class="fa fa-angle-right"></i>'],
		responsive: {
			0: {
				items: 1
			},
			480: {
				items: 1
			},
			768: {
				items: 1
			},
			992: {
				items: 1
			}
		}
    });

	$(".team-slider").owlCarousel({
		autoplay:true,
    	autoplayTimeout:4000,
    	autoplayHoverPause:true,
    	smartSpeed:500,
		loop: true,
		items : 4,
		margin: 30,
		responsiveClass: true,
		dots: false,
		nav : true,
		navText: ['<i class="fa fa-angle-left"></i>', '<i class="fa fa-angle-right"></i>'],
		responsive: {
			0: {
				items: 1
			},
			480: {
				items: 2
			},
			768: {
				items: 3
			},
			992: {
				items: 4
			}
		}
    });

	$(".testimonial-slider").owlCarousel({
		autoplay:true,
    	autoplayTimeout:4000,
    	autoplayHoverPause:true,
    	smartSpeed:500,
		loop: true,
		items : 2,
		margin: 30,
		responsiveClass: true,
		dots: false,
		nav : true,
		navText: ['<i class="fa fa-angle-left"></i>', '<i class="fa fa-angle-right"></i>'],
		responsive: {
			0: {
				items: 1
			},
			480: {
				items: 1
			},
			768: {
				items: 2
			},
			992: {
				items: 2
			}
		}
    });

	$(".relate-slider").owlCarousel({
		autoplay:false,
    	autoplayTimeout:4000,
    	autoplayHoverPause:true,
    	smartSpeed:500,
		loop: true,
		items : 3,
		margin: 30,
		responsiveClass: true,
		dots: false,
		nav : true,
		navText: ['<i class="fa fa-angle-left"></i>', '<i class="fa fa-angle-right"></i>'],
		responsive: {
			0: {
				items: 2
			},
			480: {
				items: 2
			},
			768: {
				items: 2
			},
			992: {
				items: 4
			}
		}
    });

	$(".mega-vd-slider").owlCarousel({
		autoplay:false,
    	autoplayTimeout:4000,
    	autoplayHoverPause:true,
    	smartSpeed:500,
		loop: true,
		items : 4,
		margin: 30,
		responsiveClass: true,
		dots: false,
		nav : true,
		navText: ['<i class="fa fa-angle-left"></i>', '<i class="fa fa-angle-right"></i>'],
		responsive: {
			0: {
				items: 2
			},
			480: {
				items: 2
			},
			768: {
				items: 3
			},
			992: {
				items: 5
			}
		}
    });

	/***** Magnific-popup *****/
	$('.gallery-list-item').magnificPopup({
		delegate: '.fc-icon a',
		type: 'image',
		gallery: {
			// options for gallery
			enabled: true
		},
		removalDelay: 300,
		mainClass: 'mfp-fade'
	});

	$('#video-btn').magnificPopup({
		type: 'iframe',
		iframe: {
			markup: '<div class="mfp-iframe-scaler">' +
					'<div class="mfp-close"></div>' +
					'<iframe class="mfp-iframe" frameborder="0" allowfullscreen></iframe>' +
				  '</div>',
			patterns: {
				youtube: {
					index: 'youtube.com/',
					id: 'v=',
					src: 'http://www.youtube.com/embed/%id%?autoplay=1'
				}
			},
			srcAction: 'iframe_src'
		}
	});

	/***** Smooth Scroll *****/
	smoothScroll.init({
		speed: 700
	});

	/***** Back To Top *****/
	$(window).scroll(function(){
		if($(this).scrollTop()>700){
		    $(".back-to-top a").show();
		} else{
		    $(".back-to-top a").fadeOut();
		}
	});
});
