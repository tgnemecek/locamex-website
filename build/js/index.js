function getToken(action) {
    return new Promise((resolve, reject) => {
        try {
            grecaptcha.execute('6LcvNcIUAAAAAKWPRSTrrSfvyfnqOqGTW2pnpCju', { action })
            .then((token) => {
                resolve(token);
            });
        }
        catch(err) {
            reject(err);
        }
    })
}

window.onload = function() {
    function filterClients(name, button) {
        $('section.clients .filter button').removeClass('selected');
        button.addClass('selected');
    
        let toHide = $('section.clients .carousel > li.selected').not(`.${name}`);
    
        let toShow = $(`section.clients .carousel > .${name}`);
    
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

    AOS.init({
        duration: 800
    });

    grecaptcha.ready(function() {
        getToken("index");
    });

    $('section.clients .filter button').on('click', function(e) {
        filterClients(e.target.value, $(this));
    })

    setupHero();

    $(window).scroll(changeNavBar);
    changeNavBar();
}