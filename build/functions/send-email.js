var nodemailer = require('nodemailer');
var smtpTransport = require('nodemailer-smtp-transport');

exports.handler = function(event, context, callback) {
    var transporter = nodemailer.createTransport(smtpTransport({
      service: 'gmail',
      auth: {
          user: process.env.EMAIL_ADDRESS,
          pass: process.env.EMAIL_PASSWORD
      }
    }));

    var text = 'Email body goes here';

    var mailOptions = {
      from: 'tgnemecek@yahoo.com.br',
      to: 'tgnemecek@gmail.com',
      bcc: '',
      subject: 'Test subject',
      text: text
    };

    transporter.sendMail(mailOptions, function(error, info) {
    if (error) {
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