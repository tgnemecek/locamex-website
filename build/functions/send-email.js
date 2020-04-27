const AWS = require('aws-sdk');
const querystring = require("querystring");

exports.handler = function (event, context, callback) {
  try {
    let data = querystring.parse(event.body);
    console.log(data);
    let name = data.name;
    let company = data.company;
    let email = data.email;
    let phone = data.phone;
    let message = data.message;
    // Set the region
    AWS.config.update({
      region: 'us-east-1'
    });

    // Create sendEmail params 
    let params = {
      Destination: {
        CcAddresses: [],
        ToAddresses: ['thiago@locamex.com.br']
      },
      Message: {
        Body: {
          Html: {
            Charset: "UTF-8",
            Data: `${message} - ${phone} - ${name} - ${company}`
          },
          Text: {
            Charset: "UTF-8",
            Data: `<strong>${message} - ${phone} - ${name} - ${company}</strong>`
          }
        },
        Subject: {
          Charset: 'UTF-8',
          Data: 'Formulário de Contato - Locamex'
        }
      },
      Source: 'tgnemecek@gmail.com',
      ReplyToAddresses: ['tgnemecek@gmail.com'],
    };

    // Create the promise and SES service object
    let sendPromise = new AWS.SES({
      apiVersion: '2010-12-01',
      accessKeyId: process.env.AWS_ID,
      secretAccessKey: process.env.AWS_KEY
    }).sendEmail(params).promise();

    // Handle promise's fulfilled/rejected states
    sendPromise.then(
      function (data) {
        console.log(data.MessageId);
      }).catch(
      function (err) {
        console.error(err, err.stack);
      });
  } catch (err) {
    console.log(err);
    callback(err);
  }
}