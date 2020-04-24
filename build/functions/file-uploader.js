const AWS = require('aws-sdk')

exports.handler = function(event, context, callback) {
    console.log("Function called. Generating s3 object.");
    const s3 = new AWS.S3({
        accessKeyId: process.env.AWS_ID,
        secretAccessKey: process.env.AWS_KEY,
      })

    let Bucket = "locamex-website";
    let Key = "bbb.json";

    console.log("Running PUT operation.");
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
        if (err) {
            console.log("Operation error:");
            console.log(err);
            callback(err);
        }
        if (data) {
            console.log("Operation successful!");
            callback(null, {
                statusCode: 200,
                body: data
            });
        }
    })
}