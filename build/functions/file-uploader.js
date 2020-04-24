const AWS = require('aws-sdk');
const querystring = require("querystring");
const Buffer = require( "buffer" ).Buffer;

function parseBody( body, isBase64Encoded ) {
	let normalizedBody = isBase64Encoded
		? fromBase64( body )
		: body
	;
	return( JSON.parse( normalizedBody ) );
}

exports.handler = function(event, context, callback) {
    console.log("Function called");
    console.log("Event:");
    console.log(event);
    console.log("Context:");
    console.log(context);

    console.log("Getting data.");
    let data = querystring.parse(event.body);
    let Body = new Buffer(data.buffer.replace(/^data:\w+\/\w+;base64,/, ""),'base64');
    // let Body = parseBody( event.body, event.isBase64Encoded );

    console.log("Generating s3 object.");
    const s3 = new AWS.S3({
        accessKeyId: process.env.AWS_ID,
        secretAccessKey: process.env.AWS_KEY,
      })

    let Bucket = "locamex-website";
    let Key = "file-uploads/ddd.jpg";

    console.log("Running PUT operation.");
    s3.putObject({
        Bucket,
        Key,
        ContentType: 'image/jpeg',
        ContentEncoding: 'base64',
        Body
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
                body: Body
            });
        }
    })
}