import {hidePreloader, showPreloader} from "./_helpers";

export default function renderContainer(url, args = {}) {
    const href = url;
    const $container = args['$container'] || $(document).find('.container-js');
    const $wrapper = args['$wrapper'] || $(document).find('.pagination');
    const isLoadMore = args['isLoadMore'] || false;
    const pushState = args['pushState'] || true;
    $wrapper.addClass('not-active');
    showPreloader();
    $.ajax({
        type: 'GET',
        url: href,
    }).done(function (r) {
        hidePreloader();
        $wrapper.removeClass('not-active');
        if (!r) return;
        const parser = new DOMParser();
        const $r = $(parser.parseFromString(r, "text/html"));
        const $pagination = $r.find('.pagination-js');
        const $catalog = $r.find('.container-js');
        $wrapper.html($pagination.html());
        if (isLoadMore) {
            $container.append($catalog.html());
        } else {
            if (pushState) history.pushState({}, '', href);
            $container.html($catalog.html());
            $('html, body').animate({
                scrollTop: $container.offset().top
            });
        }
    });
}