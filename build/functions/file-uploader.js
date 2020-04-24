const AWS = require('aws-sdk')

exports.handler = function(event, context, callback) {
    const s3 = new AWS.S3({
        accessKeyId: process.env.AWS_ID,
        secretAccessKey: process.env.AWS_SECRET_KEY,
      })

    let Bucket = "locamex-website";
    let Key = "bbb.json";

    s3.putObject({
        Bucket,
        Key,
        ContentType: 'application/json',
        Body: JSON.stringify({
            name: "thiago",
            lastName: "nemecek",
            type: "person"
        }),
    }, (err, data) => {
        if (err) callback(err);
        if (data) {
            callback(null, {
                statusCode: 200,
                body: data
            });
        }
    })
}