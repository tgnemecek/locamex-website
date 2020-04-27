const nodemailer = require('nodemailer');

exports.handler = function(event, context, callback) {
  try {

    let transporter = nodemailer.createTransport({
      host: "smtp.locamex.com.br",
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_ADDRESS,
        pass: process.env.EMAIL_PASSWORD
      }
    })
  
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
  catch(err) {
    callback(err);
  }
}