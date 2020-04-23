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

class SlideShow {
    constructor() {
        this.images = $('.img-container figure');
        this.playPause = $('.controls .play-pause');
        this.previous = $('.controls .previous');
        this.next = $('.controls .next');
        this.waitTime = 3000;
        this.fadeTime = 500;
        this.isPaused = false;
        this.isChanging = false;
        this.currentIndex = 0;
        this.setup();
    }
    togglePlayPause() {
        if (this.isPaused) {
            this.resume();
        } else this.pause();
    }
    pause() {
        this.isPaused = true;
        this.playPause.html('<i class="fas fa-play"></i>');
    }
    resume() {
        this.isPaused = false;
        this.playPause.html('<i class="fas fa-pause"></i>');
        this.changeImage(this.currentIndex+1, this.animate.bind(this));
    }
    manualNextImage() {
        this.pause();
        if (this.isChanging) return;
        let nextIndex = this.currentIndex + 1;
        this.changeImage(nextIndex)
    }
    manualPreviousImage() {
        this.pause();
        if (this.isChanging) return;
        let nextIndex = this.currentIndex - 1;
        this.changeImage(nextIndex)
    }
    changeImage(nextIndex, callback) {
        let last = this.images.length-1;
        if (nextIndex < 0) nextIndex = last;
        if (nextIndex > last) nextIndex = 0;

        $(this.images[this.currentIndex]).animate({ opacity: 0 }, {
            duration: this.fadeTime,
            start: () => {
                this.isChanging = true;
                this.currentIndex = nextIndex;
            },
            complete: () => {
                this.isChanging = false;
                if (callback && !this.isPaused) callback();
            }
        })
        $(this.images[nextIndex]).animate({ opacity: 1 }, {
            duration: this.fadeTime
        })
    }
    animate(immediate) {
        setTimeout(() => {
            let last = this.images.length-1;
            let nextIndex = this.currentIndex === last ? 0 : this.currentIndex+1;
            if (!this.isPaused) {
                this.changeImage(nextIndex, this.animate.bind(this));
            }
        }, immediate ? 0 : this.waitTime)
    }
    setup() {
        $(this.images[this.currentIndex]).css('opacity', 1);
        this.previous.on('click', this.manualPreviousImage.bind(this));
        this.next.on('click', this.manualNextImage.bind(this));
        this.playPause.on('click', this.togglePlayPause.bind(this));
        this.animate();
    }
}

window.onload = function() {
    $(window).scroll(changeNavBar);
    changeNavBar();
    let slideshow = new SlideShow();
}