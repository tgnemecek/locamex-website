var AWS = require('aws-sdk');

exports.handler = function (event, context, callback) {
  try {
    // Set the region
    AWS.config.update({
      region: 'us-east-1'
    });

    // Create sendEmail params 
    let params = {
      Destination: {
        CcAddresses: [],
        ToAddresses: ['tgnemecek@gmail.com']
      },
      Message: {
        Body: {
          Html: {
            Charset: "UTF-8",
            Data: "HTML_FORMAT_BODY"
          },
          Text: {
            Charset: "UTF-8",
            Data: "TEXT_FORMAT_BODY"
          }
        },
        Subject: {
          Charset: 'UTF-8',
          Data: 'Test email'
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