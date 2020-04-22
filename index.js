let version = '1.1.0';

function filterClients(name, button) {
    $('section.clients .filter button').removeClass('selected');
    button.addClass('selected');

    $('section.clients .carousel > li').not(`.${name}`)
        .removeClass('selected');
    $(`section.clients .carousel > .${name}`)
        .addClass('selected');
}

function clientsCarouselSetup() {
    let duration = 20000;
    function animate(jquery, inverse) {
        let width = jquery.innerWidth();
        let initLeft = inverse ? -width/2 : 0;
        
        jquery.css({ left: initLeft });

        jquery.animate({
            left: inverse ? 0 : -width/2
        }, {
            duration,
            easing: 'linear',
            done: () => {
                jquery.css({ left: initLeft });
                animate(jquery, inverse);
            }
        })
    }
    $('.carousel img').each(function(i) {
        $(this).stop();
        let inverse = $(this).hasClass('inverse');
        animate($(this), inverse);
    })
}

function setupHero() {
    let array = $('header .img-slideshow > div');
    let count = 0;
    let loaded = 0;

    let waitTime = 1000;
    let fadeTime = 1000;

    array.each(function(i) {
        count++;
        let src = `assets/hero/${i+1}.jpg`;
        let fakeImg = new $(`<img src="${src}">`);
        $(this).css({
            // zIndex: -i,
            backgroundImage: `url(${src})`
        })
        fakeImg.on('load', function() {
            loaded++;
            if (loaded === count) {
                animate(0, array);
            }
        })
    })
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

    $(window).resize(clientsCarouselSetup);
    clientsCarouselSetup();

    setupHero();

    setupForm();

    $(window).scroll(changeNavBar);
    changeNavBar();
}