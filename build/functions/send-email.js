const nodemailer = require('nodemailer');

exports.handler = function(event, context, callback) {
  try {
    let transporter = nodemailer.createTransport({
      // host: "smtp.locamex.com.br",
      host: "mail.www15.locaweb.com.br",
      port: 587,
      secure: true,
      auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_PASSWORD
      },
      tls: {
        rejectUnauthorized: false // Remove after domain setup
      }
    })
  
    var text = 'Email body goes here';
  
    var mailOptions = {
      from: 'tgnemecek@yahoo.com.br',
      to: 'thiago@locamex.com.br',
      bcc: '',
      subject: 'Test subject',
      text: text
    };
  
    transporter.sendMail(mailOptions, function(error, info) {
      if (error) {
        console.log(error);
        const response = {
          statusCode: 500,
          body: JSON.stringify({
            error: error.message,
          }),
        };
        callback(null, response);
      }
      const response = {
        statusCode: 200,
        body: JSON.stringify({
          message: `Email processed succesfully!`
        }),
      };
      callback(null, response);
    });
  }

  catch(err) {
    console.log(err);
    callback(err);
  }
}