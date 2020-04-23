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

let previousWidth = $(window).width();

$(window).resize(() => {
    let currentWidth = $(window).width();
    if (currentWidth !== previousWidth) {
        previousWidth = currentWidth;
        clientsCarousel(false);
    }
});
clientsCarousel(true);