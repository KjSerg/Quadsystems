export function createSidebarList() {
    const $text = $(document).find('.single-text.text');
    const $sidebar = $(document).find('.sidebar-js');
    if ($sidebar.length === 0) return;
    let html = '';
    $text.each(function (i) {
        const $t = $(this);
        const $headers = $t.find('h1,h2,h3,h4,h5,h6');
        $headers.each(function (index) {
            const $this = $(this);
            const text = $this.text().trim();
            let id = $this.attr('id');
            if (id === undefined) {
                id = 'title-' + i + index;
                $this.attr('id', id);
            }
            html += `<a class="single-content-sidebar__item" href="#${id}">${text}</a>`;
        });
    });
    $sidebar.html(html).addClass('active');
}

export function sidebarLinkListener(){
    $(document).on('click', '.sidebar-js a', function (e) {
        e.preventDefault();
        const $t = $(this);
        const href = $t.attr('href');
        if (href === undefined || href === '#') return;
        const $el = $(document).find(href);
        if ($el.length === 0) return;
        $('html, body').animate({
            scrollTop: $el.offset().top
        });
    });
}