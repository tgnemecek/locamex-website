let version = '1.2.2';

function filterClients(name, button) {
    $('section.clients .filter button').removeClass('selected');
    button.addClass('selected');

    let toHide = $('section.clients .carousel > li.selected').not(`.${name}`);

    let toShow = $(`section.clients .carousel > .${name}`);
debugger;
    toHide.find('picture').animate({
        height: 0,
        opacity: 0
    })

    let height = toShow.find('img').width() / 13;
    let minHeight = Number(toShow.find('img').css('min-height').replace("px", ""));
    height = height < minHeight ? minHeight : height;

    toShow.find('picture').animate({
        height,
        opacity: 1
    }, {
        complete: () => toShow.find('picture').css('height', 'auto')
    })

    toShow.addClass('selected');
    toHide.removeClass('selected');

    // $('section.clients .carousel > li').not(`.${name}`)
    //     .removeClass('selected');
    // $(`section.clients .carousel > .${name}`)
    //     .addClass('selected');
}

// function clientsCarouselSetup() {
//     let duration = 20000;
//     function animate(jquery, inverse) {
//         let width = jquery.innerWidth();
//         let initLeft = inverse ? -width/2 : 0;
        
//         jquery.css({ left: initLeft });

//         jquery.animate({
//             left: inverse ? 0 : -width/2
//         }, {
//             duration,
//             easing: 'linear',
//             done: () => {
//                 jquery.css({ left: initLeft });
//                 animate(jquery, inverse);
//             }
//         })
//     }
//     $('.carousel img').each(function(i) {
//         $(this).stop();
//         let inverse = $(this).hasClass('inverse');
//         animate($(this), inverse);
//     })
// }

function clientsCarousel(firstSetup) {
    let images = $('section.clients .carousel img');
    let width = images.innerWidth();
    let duration = 8000;

    if (!firstSetup) images.stop();

    function scroll(jquery, initLeft, finalLeft) {
        jquery.css({ left: initLeft });
        jquery.animate({
            left: finalLeft
        }, {
            duration,
            easing: "linear",
            complete: () => scroll(jquery, initLeft, finalLeft)
        })
    }

    images.each(function(i) {
        let reverse = $(this).hasClass('reverse');
        if (reverse) {
            $(this).css({ left: -width });
        } else {
            $(this).css({ left: 0 });
        }

        let finalLeft = reverse ? 0 : -width;
        scroll($(this), $(this).css('left'), finalLeft);

        if (firstSetup) {
            let copy = $(this).clone();
            $(this).parent().append(copy);
            scroll(copy, copy.css('left'), finalLeft);
        }
    })
}

function setupHero() {
    let array = $('header .img-slideshow picture img');

    let waitTime = 1000;
    let fadeTime = 1000;

    function animate(i, array) {
        $(array[i])
            .delay(waitTime)
            .animate({ opacity: 1 }, {
                duration: fadeTime,
                always: () => {
                    let nextIndex = i === array.length-1 ? 0 : i+1;
                    animate(nextIndex, array)
                }
            })

        let lastIndex = i > 0 ? i-1 : array.length-1;
        $(array[lastIndex])
            .delay(waitTime)
            .animate({ opacity: 0 }, {
                duration: fadeTime
            })
    }

    animate(0, array);
}

function changeNavBar() {
    let scrollY = this.scrollY;
    let bar = $('header .navigation-wrapper');
    if (scrollY) {
        bar.css({
            backgroundColor: 'rgba(255, 255, 255, 0.95)'
        })
        bar.find('p, a, i').css({
            color: 'black'
        })

    } else {
        bar.css({
            backgroundColor: 'transparent'
        })
        bar.find('p, a, i').css({
            color: 'white'
        })
    }
}

function setupForm() {
    let form = $('section.contact form');
    let thanksBox = $('.thanks-box');
    let maxSize = 100; // In MB
    form.find('.file').on('change', function(e) {
        let file = e.target.files[0];
        if (file.size > maxSize * 1000000) {
            this.value = '';
            alert(`O arquivo não pode exceder ${maxSize} MB.`)
        }
        console.log(e.target.files);
    })
    form.find('.submit').on('click', function(e) {
        let errors = 0;
        form.find('input[required]').each(function() {
            if (!$(this).val()) errors++;
            if ($(this).hasClass('email')) {
                let str = $(this).val();
                if (str.search(/@./) === -1) errors++;
            }
        })
        if (!errors) {
            e.preventDefault();
            e.stopPropagation();
            $.post(form.attr("action"), form.serialize()).then(function() {
                $('.thanks-box').css({ display: 'flex' });
            });
        }
    })
    function closeThanksBox() {
        thanksBox.css({ display: 'none' });
    }
    thanksBox.find('.background').on('click', closeThanksBox)
    thanksBox.find('.box button').on('click', closeThanksBox)
}

window.onload = function() {
    let versionEl = document.getElementById('version');
    versionEl.innerHTML = "v" + version;

    AOS.init({
        duration: 800
    });

    $('section.clients .filter button').on('click', function(e) {
        filterClients(e.target.value, $(this));
    })

    $(window).resize(() => clientsCarousel(false));
    clientsCarousel(true);

    setupForm();

    setupHero();

    $(window).scroll(changeNavBar);
    changeNavBar();
}