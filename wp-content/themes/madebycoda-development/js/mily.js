(function ($) {
    var mily = {

        setCookie: function (key, value, expiry) {
            var expires = new Date();
            expires.setTime(expires.getTime() + (expiry * 24 * 60 * 60 * 1000));
            document.cookie = key + '=' + value + ';path=/;domain=' + window.location.hostname + ';expires=' + expires.toUTCString();
        },

        getCookie: function (key) {
            var keyValue = document.cookie.match('(^|;) ?' + key + '=([^;]*)(;|$)');
            return keyValue ? keyValue[2] : null;
        },

        eraseCookie: function (key) {
            var keyValue = mily.getCookie(key);
            mily.setCookie(key, keyValue, '-1');
        },

        clearDefinedClass: function () {
            $(document).find('.m-change-body').each(function () {
                var d = $(this).data('body-class').split(' ');
                $(d).each(function (i, c) {
                    $('body').removeClass(c);
                });
            });
        }
    }

    $(function () {
        var sel = '.m-change-body';
        var exist = mily.getCookie('m-override-body-class');
        if (exist) {
            $('body').addClass(exist);
        }

        $(document).on('click', sel, function (e) {
            e.preventDefault();

            var data = $.extend({ bodyClass: false, toggle: false }, $(this).data());
            var body = $('body');
            var exist = body.hasClass(data.bodyClass);
            var bodyClass = data.bodyClass;

            mily.clearDefinedClass();


            if (data.toggle) {
                if (exist) {
                    bodyClass = '';
                } else {
                    $('body').addClass(data.bodyClass);
                }
            } else {
                $('body').addClass(data.bodyClass);
            }

            mily.setCookie('m-override-body-class', bodyClass, 1);
        });
    });
})(jQuery);