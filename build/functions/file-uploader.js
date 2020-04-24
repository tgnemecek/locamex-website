const AWS = require('aws-sdk')

exports.handler = function(event, context, callback) {
    console.log("Function called");
    console.log("Event:");
    console.log(event);
    console.log("Context:");
    console.log(context);

    console.log("Getting data.");
    let name = event.queryStringParameters.name.toUpperCase();

    console.log("Generating s3 object.");
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
            name
        }),
    }, (err, data) => {
        if (err) {
            console.log("Operation error:");
            console.log(err);
            callback(err);
        }
        if (data) {
            console.log("Operation successful!");
            console.log(data);
            callback(null, {
                statusCode: 200,
                body: JSON.stringify({
                    name
                })
            });
        }
    })
}