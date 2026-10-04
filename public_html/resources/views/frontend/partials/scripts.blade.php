<!-- =========================================
        JavaScript Files
        ========================================== -->


<script async defer crossorigin="anonymous"
    src="https://connect.facebook.net/en_GB/sdk.js#xfbml=1&version=v19.0&appId=1634426527050245" nonce="CkAfhbMZ">
</script>


<!-- jQuery JS -->
<script src="{{ asset('public/public_assist/js/assets/vendor/jquery-1.12.4.min.js') }}"></script>

<!-- Bootstrap -->
<script src="{{ asset('public/public_assist/js/assets/popper.min.js') }}"></script>
<script src="{{ asset('public/public_assist/js/assets/bootstrap.min.js') }}"></script>

<!-- Owl Slider -->
<script src="{{ asset('public/public_assist/js/assets/owl.carousel.min.js') }}"></script>

<!-- News Ticker -->
<script src="{{ asset('public/public_assist/js/assets/jquery.newsticker.min.js') }}"></script>

<!-- Magnific PopUp -->
<script src="{{ asset('public/public_assist/js/assets/magnific-popup.min.js') }}"></script>

<!-- Smooth Scroll -->
<script src="{{ asset('public/public_assist/js/assets/smooth-scroll.js') }}"></script>

<!-- Mean Menu -->
<script src="{{ asset('public/public_assist/js/assets/jquery.meanmenu.min.js') }}"></script>

<!-- Wow Animation -->
<script src="{{ asset('public/public_assist/js/assets/wow.min.js') }}"></script>

<!-- Custom JS -->
<script src="{{ asset('public/public_assist/js/plugins.js') }}"></script>
<script src="{{ asset('public/public_assist/js/custom.js') }}"></script>

<script src="{{ asset('public/public_assist/drawer_menu/tinyDrawer.js') }}"></script>

<script src="{{ asset('public/public_assist/breaking-news-ticker/breaking-news-ticker.min.js') }}"></script>

<script>
    $(window).load(function() {
        $(".trigger_popup_fricc").click(function() {
            $('.hover_bkgr_fricc').show();
        });
        $('.hover_bkgr_fricc').click(function() {
            $('.hover_bkgr_fricc').hide();
        });
        $('.popupCloseButton').click(function() {
            $('.hover_bkgr_fricc').hide();
        });
    });
</script>

<script>
    window.onscroll = function() {
        myFunction()
    };

    var navbar = document.getElementById("navbar");
    var sticky = navbar.offsetTop;

    function myFunction() {
        if (window.pageYOffset >= sticky) {
            navbar.classList.add("sticky")
        } else {
            navbar.classList.remove("sticky");
        }
    }

    $('#JustNowNews').breakingNews();
    $('#breakingNews').breakingNews({
        direction: "ltr",
        play: true,
        delayTimer: 4000,
        scrollSpeed: 3,
        stopOnHover: true,
        effect: 'slide-right'

    });
</script>

<!-- Script to handle the overlay display -->
<script>
    function showOverlay() {
        // Show the overlay
        var overlay = document.getElementById('overlay');
        overlay.style.display = 'flex';
        setTimeout(function() {
            overlay.classList.add('active');
        }, 10);
    }

    function closeOverlay() {
        // Close the overlay
        var overlay = document.getElementById('overlay');
        overlay.classList.remove('active');
        setTimeout(function() {
            overlay.style.display = 'none';
        }, 300);
    }

    // Prevent clicks on modal content from closing the overlay
    document.getElementById('modalContent').onclick = function(event) {
        event.stopPropagation();
    };
</script>

<script>
    function openPopup() {
        var liveOverlay = document.getElementById('live-overlay');
        document.getElementById('popup').style.display = 'block';
        document.getElementById('overlay1').style.display = 'block';
        liveOverlay.style.display = 'block';
    }

    function closePopup() {
        var liveOverlay = document.getElementById('live-overlay');
        document.getElementById('popup').style.display = 'none';
        document.getElementById('overlay1').style.display = 'none';
        liveOverlay.style.display = 'none';
    }
</script>

<script>
    tinyDrawer({
        callback: function(element, action) {
            console.log(element);
            console.log(action);
        }
    });
</script>

<script>
    // JavaScript code to add hover functionality programmatically
    const myLink = document.getElementById('myLink');

    myLink.addEventListener('mouseover', function() {
        this.style.color = 'red'; // Change color to red on hover
    });

    myLink.addEventListener('mouseout', function() {
        this.style.color = 'black'; // Change color back to blue when not hovered
    });
</script>

<script>
    window.onscroll = function() {
        myFunction()
    };

    var navbar = document.getElementById("navbar");
    var sticky = navbar.offsetTop;

    function myFunction() {
        if (window.pageYOffset >= sticky) {
            navbar.classList.add("sticky")
        } else {
            navbar.classList.remove("sticky");
        }
    }
</script>

<script>
    function blinkImage() {
        var image = document.querySelector('#blink img');
        setInterval(function() {
            image.style.visibility = (image.style.visibility == 'visible') ? 'hidden' : 'visible';
        }, 500); // Adjust blinking speed here (in milliseconds)
    }

    blinkImage();
</script>

<script>
    const toggleButton = document.getElementById('toggleDrawer');
    const drawer = document.getElementById('drawer-right');
    const overlay = document.getElementById('overlay1');

    toggleButton.addEventListener('click', function() {
        document.body.classList.toggle('drawer-open');
        drawer.classList.toggle('open');
        overlay.style.display = drawer.classList.contains('open') ? 'block' : 'none';
        overlay.style.backgroundColor = drawer.classList.contains('open') ? 'rgba(0, 0, 0, 0.5)' :
            'rgba(0, 0, 0, 0)';
    });

    function closeDrawer() {
        document.body.classList.remove('drawer-open');
        drawer.classList.remove('open');
        overlay.style.display = 'none';
        overlay.style.backgroundColor = 'rgba(0, 0, 0, 0)';
    }

    // Close the drawer when clicking outside of it
    document.addEventListener('click', function(event) {
        if (!drawer.contains(event.target) && !toggleButton.contains(event.target)) {
            closeDrawer();
        }
    });
</script>

{{-- <script>
        function reloadPage() {
            location.reload();
        }
        setTimeout(reloadPage, 120000);
</script> --}}

<link href="https://cdnjs.cloudflare.com/ajax/libs/toastr.js/2.0.1/css/toastr.css" rel="stylesheet" />
<script src="https://cdnjs.cloudflare.com/ajax/libs/toastr.js/2.0.1/js/toastr.js"></script>
<!-- Show Message -->

@if (session()->has('massage'))
    <script>
        toastr.{{ session('msg_type') }}("{{ session('massage') }}", "Message", {
            positionClass: 'toast-top-right'
        });
    </script>
@endif
<!-- End Message -->

<script>
    (function() {
        function retryNewsImage(image) {
        if (!(image instanceof HTMLImageElement) || image.dataset.newsMediaHostRetried === 'true') {
                return;
        }

        try {
            var url = new URL(image.currentSrc || image.src, window.location.href);
            var path = url.pathname.replace(/^\/public(?=\/images\/(?:news_img|media)\/)/i, '');
            if (!/^\/images\/(?:news_img|media)\//i.test(path)) {
                return;
            }

            var host = url.hostname.toLowerCase();
            if (host === '24ghontatv.com' || host === 'www.24ghontatv.com') {
                image.dataset.newsMediaHostRetried = 'true';
                image.src = 'https://api.24ghontatv.com' + path + url.search + url.hash;
            } else if (host === 'api.24ghontatv.com') {
                image.dataset.newsMediaHostRetried = 'true';
                image.src = 'https://24ghontatv.com/public' + path + url.search + url.hash;
            }
        } catch (error) {
            return;
        }
        }

        document.addEventListener('error', function(event) {
            retryNewsImage(event.target);
        }, true);

        document.querySelectorAll('img').forEach(function(image) {
            if (image.complete && image.naturalWidth === 0) {
                retryNewsImage(image);
            }
        });
    })();
</script>
