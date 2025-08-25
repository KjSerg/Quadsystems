import 'slick-carousel';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css'

export default class Slick {
    constructor() {
        this.init();
    }

    headSliderInit() {
        const t = this;
        $(document).find('.head-slider').each(function () {
            const $slider = $(this);
            const $prev = $(this).closest('section').find('.slick__prev');
            const $next = $(this).closest('section').find('.slick__next');
            const $dots = $(this).closest('section').find('.head-slider-dots');
            $slider.slick({
                slidesToShow: 1,
                arrows: true,
                prevArrow: $prev,
                nextArrow: $next,
                dots: true,
                appendDots: $dots
            });


        });
    }

    tripleSliderInit() {
        const t = this;
        $(document).find('.slider-triple').each(function () {
            const $slider = $(this);
            const $prev = $(this).closest('section').find('.slick__prev');
            const $next = $(this).closest('section').find('.slick__next');
            const $dots = $(this).closest('section').find('.slider-dots');
            $slider.slick({
                slidesToShow: 3,
                arrows: true,
                prevArrow: $prev,
                nextArrow: $next,
                dots: true,
                appendDots: $dots,
                responsive: [
                    {
                        breakpoint: 1024,
                        settings: {
                            slidesToShow: 2,
                            slidesToScroll: 2,
                        }
                    },
                    {
                        breakpoint: 700,
                        settings: {
                            slidesToShow: 1,
                            slidesToScroll: 1,
                        }
                    }
                ]
            });


        });
    }


    init() {
        this.headSliderInit();
        this.tripleSliderInit();
    }
}

