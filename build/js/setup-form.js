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
        if (true) {
            e.preventDefault();
            e.stopPropagation();
            console.log(form.find('.message').val());
            // $.post(".netlify/functions/send-email", form.serialize()).then(function() {
            //     $('.thanks-box').css({ display: 'flex' });
            // });
        }
    })
    function closeThanksBox() {
        thanksBox.css({ display: 'none' });
    }
    thanksBox.find('.background').on('click', closeThanksBox)
    thanksBox.find('.box button').on('click', closeThanksBox)
}

setupForm();