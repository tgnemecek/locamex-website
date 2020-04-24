exports.handler = function(event, context, callback) {
    console.log('running test-------');
    console.log("TEST_KEY = " + process.env.TEST_KEY);
    let key = process.env.TEST_KEY;
    callback(null, {
    statusCode: 200,
    body: "Hello, World: " + key
    });
}