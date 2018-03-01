'use strict';


var App = {
    modules: {}
};


(function (Application, $) {

    Application.modules.lpEvl = (function () {

        var init = function () {
            checkCookie();
        };

        var checkCookie = function () {
            var counter = getCookie("visitCounter");

            if (counter != "") {
                counter++;
                setCookie("visitCounter", counter, 365);

                if (counter > 10) {
                    $("#js-header").text($('#js-next-header').val());
                }

            } else {
                counter = 1;
                setCookie("visitCounter", counter, 365);
            }
        }

        var getCookie = function (cname) {
            var name = cname + "=";
            var decodedCookie = decodeURIComponent(document.cookie);
            var ca = decodedCookie.split(';');

            for (var i = 0; i < ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) == ' ') {
                    c = c.substring(1);
                }
                if (c.indexOf(name) == 0) {
                    return c.substring(name.length, c.length);
                }
            }
            return "";
        };

        var setCookie = function (cname, cvalue, exdays) {
            var d = new Date();
            d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
            var expires = "expires=" + d.toUTCString();
            document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
        }

        return {
            init: init
        };

    })();

    Application.modules.lpEvl.init();

})(App, jQuery);