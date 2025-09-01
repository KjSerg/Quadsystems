import SimpleBar from 'simplebar';

const list = [];

$(document).ready(function () {
    const $lists = $(document).find('.product-details-list');
    $lists.each(function (index) {
        list[index] = $(this).html();
    });
    function initOrRecalculateScrollbars() {
        $('.product-details-list').each(function (index) {
            const $el = $(this);
            if ($el.hasClass('simplebar-scrollable-y')) {
                $el.removeClass('simplebar-scrollable-y');
                $el.removeAttr('data-simplebar');
                $el.html(list[index]);
            }
            if($(window).width() <= 1023){
                return;
            }
            const $text = $el.closest('.product-details').find('.product-details__text');
            if ($text.length > 0) {
                let textH = $text.outerHeight();
                $el.css('max-height', `calc(100% - ${textH}px)`);
            } else {
                $el.css('max-height', '100%');
            }
            const newInstance = new SimpleBar($el[0]);
            $el.data('simplebarInstance', newInstance);
        });
    }
    initOrRecalculateScrollbars();
    let resizeTimer;
    $(window).on('resize', function () {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(function () {
            initOrRecalculateScrollbars();
        }, 250);
    });
});