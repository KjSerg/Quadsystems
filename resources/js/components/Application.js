import {copyToClipboard, detectBrowser, isMobile, showPreloader} from "./utils/_helpers";
import {burger} from "./ui/_burger";
import {accordion} from "./ui/_accardion";
import {numberInput} from "./forms/_number-input";
import {showPassword} from "./forms/_show-password";
import {fancyboxInit, showMsg, showNotices} from "../plugins/_fancybox-init";
import {selectrickInit} from "../plugins/_selectric-init";
import Slick from "../plugins/Slick";
import {createSidebarList, sidebarLinkListener} from "./ui/_article";
import '../plugins/_simplebar-init'


export default class Application {
    constructor() {
        this.$doc = $(document);
        this.$body = $("body");
        this.parser = new DOMParser();
        this.init();
    }

    init() {
        this.initBrowserAttributes();
        this.initComponents();
    }

    showLoaderOnClick() {
        this.$doc.on('click', 'a.show-load, .header a, .footer a', function (e) {
            if (!$(this).attr('href').includes('#')) showPreloader();
        });
    }

    initBrowserAttributes() {
        const browserName = detectBrowser();
        this.$body.attr("data-browser", browserName).addClass(browserName);

        if (isMobile) {
            this.$body.attr("data-mobile", "mobile");
        }
    }

    initComponents() {
        this.$doc.ready(() => {
            burger();
            accordion();
            numberInput();
            showPassword();
            selectrickInit();
            fancyboxInit();
            createSidebarList();
            this.showLoaderOnClick();
            this.linkListener();
            const slider = new Slick();
        });
    }


    linkListener() {
        const t = this;
        sidebarLinkListener();
        this.$doc.on('click', 'a[href*="#"]:not(.fancybox)', function (e) {
            e.preventDefault();
            const $t = $(this);
            const href = $t.attr('href');
            if (href === '#') return;
            const hashValue = href.split('#')[1];
            if (hashValue !== undefined) {
                const $el = t.$doc.find('#' + hashValue);
                if ($el.length > 0) {
                    $('html, body').animate({
                        scrollTop: $el.offset().top
                    });
                    return;
                }
            }
            window.location.href = href;
        });
        this.$doc.on('click', '[data-link]', function (e) {
            e.preventDefault();
            const $t = $(this);
            const href = $t.attr('data-link');
            if (href === '#') return;
            const hashValue = href.split('#')[1];
            if (hashValue !== undefined) {
                const $el = t.$doc.find('#' + hashValue);
                if ($el.length > 0) {
                    $('html, body').animate({
                        scrollTop: $el.offset().top
                    });
                    return;
                }
            }
            window.location.href = href;
        });
        this.$doc.on('click', '.applications-head__item', function (e) {
            e.preventDefault();
            const $t = $(this);
            const href = $t.attr('href');
            if($(window).width() <= 450){
                if($t.hasClass('active')){
                    $t.closest('.applications-head').find('.applications-head__item').slideDown();
                    return;
                }
            }
            if (href === '#') return;
            window.location.href = href;
        });
        this.$doc.on('click', '.copy-link-js', function (e) {
            e.preventDefault();
            const $t = $(this);
            const href = $t.attr('href');
            if (href === '#') return;
            copyToClipboard(href);
            showMsg(copiedString);
        });

    }
}