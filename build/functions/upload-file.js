const AWS = require('aws-sdk');
const querystring = require("querystring");
const Buffer = require( "buffer" ).Buffer;

module.exports = function(file, filename, callback) {
    try {
        console.log("Function called");
        console.log("Event:");
        
        console.log("Getting data.");
        let Body = new Buffer(file.replace(/^data:\w+\/\w+;base64,/, ""),'base64');
    
        console.log("Generating s3 object.");
        const s3 = new AWS.S3({
            accessKeyId: process.env.AWS_ID,
            secretAccessKey: process.env.AWS_KEY,
          })
    
        let Bucket = "locamex-website";
        let Key = `file-uploads/${filename}`;
    
        console.log("Running PUT operation.");
        s3.upload({
            Bucket,
            Key,
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
                callback(null, data.Location);
            }
        })
    }
    catch(err) {
        console.log(err);
        callback(err);
    }
}