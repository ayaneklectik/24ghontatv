<style>
    .container_top_five {
        display: grid;
        grid-template-columns: repeat(5, 1fr);
        /* Default: 5 cards in a row */
        gap: 10px;
        padding: 20px;
        justify-content: center;
    }

    .card_top_five {
        text-align: center;
        border: 1px solid #ddd;
        padding: 10px;
        position: relative;
        box-sizing: border-box;
    }

    .card_top_five .number {
        position: absolute;
        top: -20px;
        left: 50%;
        transform: translateX(-50%);
        background-color: red;
        color: white;
        font-weight: bold;
        border-radius: 50%;
        width: 50px;
        height: 50px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 35px;
    }

    .card_top_five .number.black {
        background-color: black;
    }

    .card_top_five img {
        width: 100%;
        height: auto;
        margin-bottom: 10px;
    }

    .card_top_five p {
        margin: 0;
        font-size: 16px;
        font-weight: bold;
        height: 70px;
    }

    /* Responsive styles */
    @media (max-width: 1200px) {
        .container_top_five {
            grid-template-columns: repeat(4, 1fr);
        }
    }

    @media (max-width: 992px) {
        .container_top_five {
            grid-template-columns: repeat(3, 1fr);
        }
    }

    @media (max-width: 768px) {
        .container_top_five {
            grid-template-columns: repeat(2, 1fr);
            /* ✅ 2 per row on small screens */
        }
    }

    @media (max-width: 480px) {
        .container_top_five {
            grid-template-columns: repeat(2, 1fr);
            /* still 2 per row on very small screens */
        }
    }
</style>
@php
    $news_1 = App\Http\Controllers\StaticLinkController::getNewsByID($top_news_1->news_id);
    $news_2 = App\Http\Controllers\StaticLinkController::getNewsByID($top_news_2->news_id);
    $news_3 = App\Http\Controllers\StaticLinkController::getNewsByID($top_news_3->news_id);
    $news_4 = App\Http\Controllers\StaticLinkController::getNewsByID($top_news_4->news_id);
    $news_5 = App\Http\Controllers\StaticLinkController::getNewsByID($top_news_5->news_id);
@endphp

<div class="container_top_five">
    <a href="{{ route('news-details', [$top_news_1->news_id]) }}" style="font-size:20px; color:#000">
        <div class="card_top_five">
            <div class="number">১</div>

            <img src="{{ asset($news_1 && $news_1->image ? 'public/images/news_img/' . $news_1->image : 'public/images/no_image.jpg') }}"
                alt="No image" width="200">

            <p style="height: 70px">
                {{ $news_1 && $news_1->news_title ? $news_1->news_title : '' }}
            </p>
        </div>
    </a>

    <a href="{{ route('news-details', [$top_news_2->news_id]) }}" style="font-size:20px; color:#000">
        <div class="card_top_five">
            <div class="number">২</div>

            <img src="{{ asset($news_2 && $news_2->image ? 'public/images/news_img/' . $news_2->image : 'public/images/no_image.jpg') }}"
                alt="No image" width="200">

            <p style="height: 70px">
                {{ $news_2 && $news_2->news_title ? $news_2->news_title : '' }}
            </p>
        </div>
    </a>

    <a href="{{ route('news-details', [$top_news_3->news_id]) }}" style="font-size:20px; color:#000">
        <div class="card_top_five">
            <div class="number black">৩</div>

            <img src="{{ asset($news_3 && $news_3->image ? 'public/images/news_img/' . $news_3->image : 'public/images/no_image.jpg') }}"
                alt="No image" width="200">

            <p style="height: 70px">
                {{ $news_3 && $news_3->news_title ? $news_3->news_title : '' }}
            </p>
        </div>
    </a>

    <a href="{{ route('news-details', [$top_news_4->news_id]) }}" style="font-size:20px; color:#000">
        <div class="card_top_five">
            <div class="number">৪</div>

            <img src="{{ asset($news_4 && $news_4->image ? 'public/images/news_img/' . $news_4->image : 'public/images/no_image.jpg') }}"
                alt="No image" width="200">

            <p style="height: 70px">
                {{ $news_4 && $news_4->news_title ? $news_4->news_title : '' }}
            </p>
        </div>
    </a>

    <a href="{{ route('news-details', [$top_news_5->news_id]) }}" style="font-size:20px; color:#000">
        <div class="card_top_five">
            <div class="number">৫</div>

            <img src="{{ asset($news_5 && $news_5->image ? 'public/images/news_img/' . $news_5->image : 'public/images/no_image.jpg') }}"
                alt="No image" width="200">

            <p style="height: 70px">
                {{ $news_5 && $news_5->news_title ? $news_5->news_title : '' }}
            </p>
        </div>
    </a>
</div>
