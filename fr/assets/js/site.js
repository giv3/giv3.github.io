(function (document, window) {
    "use strict";

    var frCanonical = 'donn3.ca';
    var frHostNames = [
        'donne3.ca',
        'donnetrois.ca',
        'donn3.com',
        'donne3.com',
        'donnetrois.com'
    ];
    var enCanonical = 'giv3.ca';
    var enHostNames = [
        'give3.ca',
        'givethree.ca',
        'giv3.com',
        'give3.com',
        'givethree.com'
    ];
    var allHostNames = [enCanonical, frCanonical].concat(enHostNames).concat(frHostNames);
    var isProduction = allHostNames.includes(window.location.hostname);

    $(function () {


        handleDomainAliases();

        document.getElementById('copyright-year').textContent = new Date().getFullYear();

        var body = $('body');
        $('#nav-burger').click(function (e) {
            e.preventDefault();
            body.toggleClass('nav-open');
        });
        $('#main-nav-trunk a').click(function () {
            body.removeClass('nav-open');
        });

        $('a').click(function (e) {
            var href = $(this).attr('href');
            // make hash links scroll
            if (href.startsWith('#')) {
                e.preventDefault();
                var scroll = href === '#' ? 0 : $(href).offset().top;
                var currentScroll = $(window).scrollTop();
                var speed = Math.sqrt(Math.abs(currentScroll - scroll)) * 10;
                $('html, body').animate({scrollTop: scroll}, speed, 'swing');
                window.history.replaceState({}, '', href);
                return;
            }
            // handle absolute links in local and staging
            if (!isProduction) {
                var url = new URL(href);
                if (allHostNames.includes(url.hostname)) {
                    e.preventDefault();
                    url.protocol = window.location.protocol;
                    url.host = window.location.host;

                    window.location.replace(url);
                }
            }
        });
    });

    var handleDomainAliases = function () {
        if (!isProduction) {
            // ignore for local and staging
            return;
        }

        if (
            (
                window.location.pathname.startsWith('/fr') &&
                window.location.hostname !== frCanonical
            ) || (
                !window.location.pathname.startsWith('/fr') &&
                window.location.hostname === frCanonical
            )

        ) {
            return changeHostName(
                frCanonical,
                '/fr' + window.location.hostname.replace(/^\/fr/, '')
            );
        }
    };

    var changeHostName = function (hostName, path) {
        path = path || window.location.pathname;
        var url = 'https://' + hostName + path + window.location.hash;
        window.location.replace(url);
    };
})(document, window);