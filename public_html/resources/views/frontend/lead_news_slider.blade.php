
<div id="slider-container">
    <div class="slider-wrapper">
        <div class="slider-item">
            <img class="slider-image" src="{{asset('public/images/news_img/image1.jpg')}}" alt="Image 1">
            <div class="slider-text-container">
                <div class="new-date-time">
                    <i class="fa fa-calendar"></i> ২৫ জানুয়ারি, ২০২৪
                </div>
                <div class="slider-text new-title">
                <h4><a href=""><b><a href="">পাবনা-৩ আসনে পুন:নির্বাচনের দাবি স্বতন্ত্র প্রার্থীর পাবনা-৩ আসনে পুন:নির্বাচনের দাবি স্বতন্ত্র প্রার্থীর</b></a></h4>
                </div>
            </div>
        </div>

        <div class="slider-item">
            <img class="slider-image" src="{{asset('images/news_img/image2.jpg')}}" alt="Image 2">
            <div class="slider-text-container">
                <div class="new-date-time">
                    <i class="fa fa-calendar"></i> ২৫ জানুয়ারি, ২০২৪
                </div>
                <div class="slider-text new-title">
                <h4><b>পাবনা-৩ আসনে পুন:নির্বাচনের দাবি স্বতন্ত্র প্রার্থীর পাবনা-৩ আসনে পুন:নির্বাচনের দাবি স্বতন্ত্র প্রার্থীর</b></h4>
                </div>
            </div>
        </div>

        <div class="slider-item">
            <img class="slider-image" src="{{asset('images/news_img/image3.jpg')}}" alt="Image 3">
            <div class="slider-text-container">
                <div class="new-date-time">
                    <i class="fa fa-calendar"></i> ২৫ জানুয়ারি, ২০২৪
                </div>
                <div class="slider-text new-title">
                <h4><b>পাবনা-৩ আসনে পুন:নির্বাচনের দাবি স্বতন্ত্র প্রার্থীর পাবনা-৩ আসনে পুন:নির্বাচনের দাবি স্বতন্ত্র প্রার্থীর</b></h4>
                </div>
            </div>
        </div>
    </div>

    <div class="arrow left" onclick="prevSlide()">&#9665;</div>
    <div class="arrow right" onclick="nextSlide()">&#9655;</div>
</div>

<script>
    let currentSlide = 0;
    const totalSlides = document.querySelectorAll('.slider-item').length;
    const sliderWrapper = document.querySelector('.slider-wrapper');

    function showSlide(index) {
        const translateValue = -index * 100 + '%';
        sliderWrapper.style.transform = 'translateX(' + translateValue + ')';
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % totalSlides;
        showSlide(currentSlide);
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        showSlide(currentSlide);
    }

    setInterval(nextSlide, 4000); // Advance every 3 seconds

    showSlide(currentSlide); // Show the initial slide
</script>
