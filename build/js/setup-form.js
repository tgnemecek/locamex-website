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
    })
    form.find('#submit').on('click', function(e) {
        let errors = 0;
        let data = {};
        let inputs = form.find('input, textarea');
        inputs.each(function() {
            data[$(this).attr("name")] = $(this).val();

            if ($(this).attr("required")) {
                if (!$(this).val()) errors++;
                if ($(this).hasClass('email')) {
                    let str = $(this).val();
                    if (str.search(/@./) === -1) errors++;
                }
            }
        })
        if (!errors) {
            // Form verification passed, prevent automatic submission
            e.preventDefault();
            e.stopPropagation();

            // Get file, if any
            let file = form.find('#file').prop('files')[0];

            // Clear fields
            inputs.val("");
            form.find("#file").prop('files')[0] = "";
            $('.contact .loading-box').css({ display: 'flex' });

            // Send Event to Google Analytics
            gtag('event', 'Orçamento', {
                'event_category' : 'Pedido de Orçamento',
                'event_label' : 'Envio de Formulário'
            });

            if (file) {
                let filename = file.name;
                let reader = new FileReader();
                reader.onloadend = () => {
                    data.file = reader.result;
                    data.filename = filename;
                    getToken("submitForm").then((token) => {
                        sendEmail({...data, token});
                    })
                }
                reader.readAsDataURL(file);
            } else {
                delete data.file;
                delete data.filename;
                getToken("submitForm").then((token) => {
                    sendEmail({...data, token});
                })
            }
        }
    })
    function sendEmail(data) {
        $.ajax({
            url: ".netlify/functions/send-email",
            context: document.body,
            method: "POST",
            data,
            success: function(res) {
                $('.contact .loading-box').css({ display: 'none' });
                $('.thanks-box').css({
                    display: 'flex'
                });
            },
            error: function(h, type, error) {
                alert("Erro de Servidor!")
                $('.contact .loading-box').css({ display: 'none' });
                console.log(type);
                console.log(error);
            }
        });
    }
    function closeThanksBox() {
        thanksBox.css({ display: 'none' });
    }
    thanksBox.find('.background').on('click', closeThanksBox)
    thanksBox.find('.box button').on('click', closeThanksBox)
}

setupForm();