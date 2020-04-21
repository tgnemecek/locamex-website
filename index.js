let version = '0.0.1';

function filterClients(name, button) {
    $('section.clients .filter button').removeClass('selected');
    button.addClass('selected');

    let hidden = {
        height: `0`
    }
    let shown = {
        height: 183 // This should be the exact image height
    }

    $('section.clients .carousel > li').not(`.${name}`).css(hidden);
    $(`section.clients .carousel > .${name}`).css(shown);
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
                console.log('all loaded');
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
        bar.find('p, a').css({
            color: 'black'
        })

    } else {
        bar.css({
            backgroundColor: 'transparent'
        })
        bar.find('p, a').css({
            color: 'white'
        })
    }
}

function setupForm() {
    let form = $('section.contact form');
    let maxSize = 100; // In MB
    form.find('.file').on('change', function(e) {
        let file = e.target.files[0];
        if (file.size > maxSize * 1000000) {
            this.value = '';
            alert(`O arquivo não pode exceder ${maxSize} MB.`)
        }
        console.log(e.target.files);
    })
}

window.onload = function() {
    let versionEl = document.getElementById('version');
    versionEl.innerHTML = "v" + version;
    AOS.init({
        duration: 1000
    });

    $('section.clients .filter button').on('click', function(e) {
        filterClients(e.target.value, $(this));
    })

    filterClients('main', $('.filter .selected'));

    clientsCarouselSetup();

    setupHero();

    setupForm();

    $(window).scroll(changeNavBar);
    changeNavBar();
}