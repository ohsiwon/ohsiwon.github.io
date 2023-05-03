if (!window.console) console = { log: function(){} };

(function(){
    var wf = document.createElement('script');
    wf.src = ('https:' == document.location.protocol ? 'https' : 'http') + '://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js';
    wf.type = 'text/javascript';
    wf.async = 'true';
    var s = document.getElementsByTagName('script')[0];
    s.parentNode.insertBefore(wf, s);

    if (navigator.appVersion.indexOf('Window') != -1){
        $('html body').css('-webkit-text-stroke', '0.18px');
    };
})();

var osean = function()
{
    'use strict';
    var workdata = {},
    $bg = new canvasBackground();

    function loadData()
    {
        $.ajax(
        {
            url: 'json/contents.json',
            dataType: 'json',
            success: onSuccessListener,
            error: onErrorListener,
        });

        function onSuccessListener(result)
        {
            constructWorkPage(result)
        };

        function onErrorListener(jqXHR, status, error)
        {
            alert('Page error.\n\nStatus [' + error + ']\n\nPlease contact administrator for further information.');
        };
    };

    function constructWorkPage(data)
    {
        var $d = data.work,
            logo_ext, parent = $('.page2 .thumbs');
        $.each($d, function(i, v)
        {
            $('<h3>').text($d[i].name).appendTo(parent);
            $.each($d[i].data, function(i, v)
            {
                var container = $('<a class="cta"/>').attr('href', 'work/' + v.perma).appendTo(parent);
                $('<span>').text(v.title).appendTo(container);
                $('<img>').attr('src', 'img/' + v.perma + '.jpg').appendTo(container);
                workdata[v.perma] = v;
            });
        });
        parent.children('.footnote').appendTo(parent);
        $('#ajax-loader').animate(
        {
            opacity: 1
        }, 100);
        if (Modernizr.canvas) logo_ext = 'svg';
        else logo_ext = 'png';
        $('<img src="img/logo.' + logo_ext + '"/>').load(function()
        {
            $('#ajax-loader').stop().animate(
            {
                opacity: 0
            }, function()
            {
                $(this).remove();
                initPages();
                $.address.update();
            })
        })
    };


    function initPages()
    {
        /* ===============
        Global
       =============== */

        // Public variables
        var $pc = $('.page-container');
        var $p, $op, $np, menu, page1, page2, page3, page4;

        //build private functions
        menu = new menuBuilder();
        page1 = new page1Builder();
        page2 = new page2Builder();
        page3 = new page3Builder();

        //start only if browser support canvas
        if (Modernizr.canvas)
        {

            //init setting panel
            page4 = new page4Builder();

            //Response JS - Update page size
            (function(window, document, $, R)
            {
                R.crossover(function(e)
                {
                    if (!$pc.hasClass('invisible'))
                    {
                        $p = $('.page' + menu.selBtnNum);

                        var t = setTimeout(function()
                        {
                            clearTimeout(t);

                            $pc.addClass('no-transition');
                            $pc.css3trans(
                            {
                                width: $p.width(),
                                height: $p.height()
                            });
                        }, 25);
                    }
                }, "width");
            }(this, document, jQuery, Response));
        }

        //Deeplinking
        $.address.change(function(e)
        {
            var v = e.value.replace(/^\//, '').split('/');
            switch (v[0])
            {
            case '':
                closePage();
                break;
            case 'hello':
                menu.clickEvent($('.menu-container ul li:nth-child(1) a'));

                if (v[1] != null)
                {
                    switch (v[1])
                    {
                    case 'about':
                        page1.clickEvent($('.page1 .nav a:nth-child(1)'));
                        break;
                    case 'experience':

                        page1.clickEvent($('.page1 .nav a:nth-child(2)'));
                        break;
                    case 'history':

                        page1.clickEvent($('.page1 .nav a:nth-child(3)'));
                        break;
                    }
                }

                break;
            case 'work':
                menu.clickEvent($('.menu-container ul li:nth-child(2) a'));

                if (v[1] != null)
                {
                    page2.clickEvent(v[1]);
                }
                else
                {
                    page2.showlist();
                }

                break;
            case 'say-hi':
                page3.reset();
                menu.clickEvent($('.menu-container ul li:nth-child(3) a'));
                break;
            case 'setting':
                menu.clickEvent($('.menu-container ul li:nth-child(4) a'));
                break;
            }

        });

        $('.cta').address(function()
        {
            return $(this).attr('href').replace(/^#/, '');
        });

        $('.cta').click(function(e)
        {
            if ($pc.hasClass('no-transition')) $pc.removeClass('no-transition');
        });

        /* ===============
        Main menu
       =============== */
        function menuBuilder()
        {
            var selBtn, selBtnNum = 0;
            this.clickEvent = function(v)
            {
                var i = $(v).parent().index();
                if (!$(v).hasClass('selected'))
                {
                    switch (i)
                    {
                    case 0:
                        if (page1.selTabNum != 1) page1.clickEvent($('.page1 .nav a:nth-child(1)'));
                        break;
                    case 1:
                        page2.reset();
                        break;
                    }
                    if (menu.selBtn) menu.selBtn.removeClass('selected');
                    $(v).addClass('selected');
                    menu.selBtn = $(v);
                    $op = $('.page' + menu.selBtnNum);
                    $np = $('.page' + (i + 1));
                    $np.removeClass('invisible').delay(600).animate(
                    {
                        opacity: 1
                    }, 600);
                    if ($pc.hasClass('invisible'))
                    {
                        $pc.removeClass('invisible').css3trans(
                        {
                            opacity: 1,
                            width: $np.width(),
                            height: $np.height()
                        });
                    }
                    else
                    {
                        $pc.css3trans(
                        {
                            width: $np.width(),
                            height: $np.height()
                        });
                        $op.css('opacity', 0).addClass('invisible');
                    }
                    menu.selBtnNum = i + 1;
                }
            };
        };


        /* ===============
        Page (All)
       =============== */

        function closePage()
        {
            if (menu.selBtn != undefined) menu.selBtn.removeClass('selected');
            $op = $('.page' + menu.selBtnNum);
            $pc.css3trans(
            {
                opacity: 0
            });
            $op.animate(
            {
                opacity: 0
            }, 600, function()
            {
                $op.addClass('invisible');
                $pc.addClass('invisible').css(
                {
                    width: 300,
                    height: 300
                });
            });
        };

        /* ===============
        Page 1
        =============== */
        function page1Builder()
        {
            var selTabNum = 1;
            this.clickEvent = function(v)
            {
                var i = $(v).index();
                if (!$(v).hasClass('selected'))
                {
                    var oldTab = $('.page1 .nav :nth-child(' + selTabNum + ')');
                    if ($(v) != oldTab) oldTab.removeClass('selected');
                    $(v).addClass('selected');
                    var oldContent = $('.page1 .content div:nth-child(' + selTabNum + ')');
                    var newContent = $('.page1 .content div:nth-child(' + (i + 1) + ')');
                    oldContent.fadeOut(350, function()
                    {
                        newContent.fadeIn(350).removeClass('invisible');
                        $pc.css3trans(
                        {
                            'height': $('.page1').height()
                        });
                    });
                    selTabNum = i + 1;
                }
            };
        };

        /* ===============
        Page 2
       =============== */
        function page2Builder()
        {
            var oldContent,
            newContent,
            reset;

            this.clickEvent = function(k)
            {
                reset = false;
                oldContent = $('.page2 .thumbs');
                newContent = $('.page2 .description');
                loadDetail(k);
                swapScreen(oldContent, newContent);
            };

            this.reset = function()
            {
                reset = true;
            };

            this.showlist = function()
            {
                if (reset)
                {
                    $('.page2 .thumbs').show();
                    $('.page2 .description').hide();
                    $pc.css('height', $('.page2').height());
                }
                else
                {
                    oldContent = $('.page2 .description');
                    newContent = $('.page2 .thumbs');
                    swapScreen(oldContent, newContent);
                }
            };

            function swapScreen(oc, nc)
            {
                var gap, dy;
                oc.fadeOut(450, function()
                {
                    nc.fadeIn(1000).removeClass('invisible');
                    dy = $('.page-container').offset().top - 20;
                    gap = $(window).scrollTop() - dy - 60;
                    if (oc.hasClass('thumbs') && gap > 0)
                    {
                        $('html, body').stop().animate(
                        {
                            scrollTop: dy
                        }, gap * 1.5, setHeight);
                    }
                    else
                    {
                        setHeight();
                    }
                });

                function setHeight()
                {
                    $pc.animate(
                    {
                        height: $('.page2').height()
                    }, 200);
                };
            };

            function loadDetail(k)
            {
                var img, li, launch,
                $d = workdata[k],
                    $slide = $('.page2 .description .carousel .slide'),
                    $carousel_nav = $('.page2 .description .carousel-nav'),
                    $pagn = $('.page2 .description .carousel-nav .pagination'),
                    $content = $('.page2 .description .content'),
                    $nav = $('.page2 .description .nav');
                $slide.empty();
                $pagn.empty();

                if ($d.num_slide == 1)
                {
                    img = $('<img/>').attr('src', 'img/slide/' + $d.perma + '-1.jpg').addClass('active').css('opacity', 0).appendTo($slide);
                    img.load(imgLoadComplete);
                    $carousel_nav.hide();
                    $pagn.hide();
                }
                else
                {
                    for (var i = 1; i <= $d.num_slide; i++)
                    {
                        img = $('<img/>').attr('src', 'img/slide/' + $d.perma + '-' + i + '.jpg').css('opacity', 0).appendTo($slide);
                        img.load(imgLoadComplete);
                        li = $('<li class="cta"/>').appendTo($pagn).click(slideCarouselImage);

                        if (i == 1)
                        {
                            img.addClass('active');
                            li.addClass('active');
                        }
                    }
                    $carousel_nav.show();
                    $pagn.show();
                }

                $content.find('#title').text($d.title);
                if ($d.client != null)
                {
                    $content.find('#client').text($d.client);
                    $content.find('li:nth-child(1)').show();
                }
                else $content.find('li:nth-child(1)').hide();

                if ($d.client != null)
                {
                    $content.find('#agency').text($d.agency);
                    $content.find('li:nth-child(2)').show();
                }
                else $content.find('li:nth-child(2)').hide();

                $content.find('#type').text($d.type);
                $content.find('#role').text($d.role);
                $content.children('#desc').html($d.desc);


                $nav.children('#launch').remove();

                if ($d.url != null) launch = $('<a id="launch" href="' + $d.url + '" target="_blank"/>').text('Launch site');
                else launch = $('<span id="launch"/>').text('Archived');
                $nav.prepend(launch);

                function imgLoadComplete()
                {
                    $(this).animate(
                    {
                        opacity: 1
                    }, 250);
                };
            };

            var total, oi, ni, n_idx, reverse,
            $slide = $('.page2 .description .carousel .slide'),
                $pagn = $('.page2 .description .carousel-nav .pagination');

            function initCarouselNav()
            {
                //Add clickEvent on Nav arrow
                $('.page2 .description .carousel-nav span').click(function()
                {
                    if (!$slide.is(':animated'))
                    {
                        reverse = ($(this).attr('id') == 'left') ? true : false;
                        total = $slide.children('img').length;
                        oi = $slide.children('.active');

                        if (reverse)
                        {
                            n_idx = oi.index() - 1;
                            if (n_idx < 0) n_idx = total - 1;
                        }
                        else
                        {
                            n_idx = oi.index() + 1;
                            n_idx %= total;
                        }
                        slideCarouselImage();
                    }
                });

                //initialize mobile swipe detection
                $('.carousel-nav').on('swipeleft swiperight', function(e)
                {
                    if (e.type == "swiperight")
                    {
                        $('.page2 .description .carousel-nav #left').trigger('click');
                    }
                    if (e.type == "swipeleft")
                    {
                        $('.page2 .description .carousel-nav #right').trigger('click');
                    }
                });

            };

            function slideCarouselImage()
            {
                if ($(this).is('li'))
                {
                    reverse = (n_idx > $(this).index()) ? true : false;
                    n_idx = $(this).index();
                }
                oi = $slide.children('.active');
                ni = $slide.children('img:nth-child(' + (n_idx + 1) + ')');
                ni.css(
                {
                    'position': 'absolute',
                    'display': 'inline-block',
                    'left': $slide.width() * ((reverse) ? -1 : 1)
                });
                $slide.animate(
                {
                    left: $slide.width() * ((reverse) ? 1 : -1)
                }, 600, function()
                {
                    oi.removeClass('active').css(
                    {
                        'display': 'none'
                    });
                    ni.addClass('active').css(
                    {
                        'position': 'relative',
                        'left': 0
                    });
                    $(this).css('left', 0);
                    $pagn.children('.active').removeClass('active');
                    $pagn.children('li:nth-child(' + (n_idx + 1) + ')').addClass('active');
                });
            };

            initCarouselNav();
            $('.menu-container').removeClass('invisible').animate(
            {
                opacity: 1
            }, 600); //.css('opacity', 1);
            if (Modernizr.canvas) $bg.start();
        };

        /* ===============
        Page 3
       =============== */
        function page3Builder()
        {
            var vaild, value, regExp_fill = /([^\s])/,
                regExp_email = /\S+@\S+/,
                $form = $('.page3 .email-form'),
                $submit_msg = $('.page3 .submit_message'),
                $name = $('.page3 .email-form #name'),
                $email = $('.page3 .email-form #email'),
                $content = $('.page3 .email-form #content');
            $('.page3 .submit').click(sendmail);
            this.reset = function()
            {
                $form.css('opacity', 1);
                $name.val('').parent().removeClass('error');
                $email.val('').parent().removeClass('error');
                $content.val('').parent().removeClass('error');
                $submit_msg.addClass('invisible');
            };

            function sendmail()
            {
                var valid = true;
                if (regExp_fill.test($name.val())) $name.parent().removeClass('error');
                else
                {
                    $name.parent().addClass('error');
                    valid = false;
                }
                if (regExp_email.test($email.val())) $email.parent().removeClass('error');
                else
                {
                    $email.parent().addClass('error');
                    valid = false;
                }
                if (regExp_fill.test($content.val())) $content.parent().removeClass('error');
                else
                {
                    $content.parent().addClass('error');
                    valid = false;
                }
                if (valid)
                {
                    value = {
                        name: $name.val(),
                        email: $email.val(),
                        content: $content.val(),
                    };
                    $.ajax(
                    {
                        type: 'POST',
                        url: 'php/sendmail.php',
                        data: value,
                        success: onSuccessListener,
                        error: onErrorListener,
                    });
                }
            };
            function onSuccessListener(result)
            {
                $form.animate(
                {
                    opacity: 0
                }, 500);
                $submit_msg.css('opacity', 0).removeClass('invisible').delay(700).animate(
                {
                    opacity: 1
                }, 500);
            };

            function onErrorListener(jqXHR, status, error)
            {
                alert('Page error.\n\nStatus [' + error + ']\n\nPlease contact administrator for further information.');
            };
        };

        /* ===============
        Page 4
       =============== */
        function page4Builder()
        {
            var selPiloting, selThrottle, savedData = {};
            savedData = readCookie('setting');
            if (savedData == null)
            {
                savedData = {
                    piloting: 2,
                    throttle: 2
                };
                createCookie('setting', savedData, 7);
            }
            selPiloting = $('.page4 #piloting li:nth-child(' + savedData.piloting + ')').addClass('selected');
            selThrottle = $('.page4 #throttle li:nth-child(' + savedData.throttle + ')').addClass('selected');
            $bg.piloting($(selPiloting).index() + 1, true);
            $bg.throttle($(selThrottle).attr('control'));
            $('.page4 #piloting li').click(function()
            {
                if (!$(this).hasClass('selected'))
                {
                    $bg.piloting($(this).index() + 1);
                    selPiloting.removeClass('selected');
                    $(this).addClass('selected');
                    selPiloting = $(this);
                    createCookie('setting',
                    {
                        piloting: ($(this).index() + 1),
                        throttle: ($(selThrottle).index() + 1)
                    });
                }
            });
            $('.page4 #throttle li').click(function()
            {
                if (!$(this).hasClass('selected'))
                {
                    $bg.throttle($(this).attr('control'));
                    selThrottle.removeClass('selected');
                    $(this).addClass('selected');
                    selThrottle = $(this);
                    createCookie('setting',
                    {
                        piloting: ($(selPiloting).index() + 1),
                        throttle: ($(this).index() + 1)
                    });
                }
            });
            $('.page4 .hide_main_window').click(hideMainWindow);
            $('#collapsed_menu').click(showMainWindow);

            function hideMainWindow()
            {
                $('.overlay').stop().animate(
                {
                    opacity: 0
                }, 500, function()
                {
                    $(this).hide();
                    $('#collapsed_menu').animate(
                    {
                        top: 0
                    }, 400);
                });
            };

            function showMainWindow()
            {
                $.address.path('/');
                $('#collapsed_menu').stop().animate(
                {
                    top: -25
                }, 500);
                $('.overlay').stop().delay(400).show().animate(
                {
                    opacity: 1
                }, 500);
            };
        };
    };
    loadData();
};

$.fn.css3trans = function(data)
{
    if (Modernizr.csstransitions) $(this).css(data);
    else $(this).animate(data, 700);
};

function createCookie(name, value, days)
{
    if (days)
    {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        var expires = "; expires=" + date.toGMTString();
    }
    else var expires = "";
    document.cookie = escape(name) + "=" + JSON.stringify(value) + expires + "; path=/";
};

function readCookie(name)
{
    var result = document.cookie.match(new RegExp(name + '=([^;]+)'));
    if (result) return JSON.parse(result[1]);
    else return null;
};

function eraseCookie(name)
{
    createCookie(name, "", - 1);
};

$(document).ready(function(){
    WebFontConfig = {
        google: { families: ['Raleway:400,500,700:latin'] },
        active: osean
    };    
});