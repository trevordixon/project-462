var Firebase = require('firebase');
var messagesRef = new Firebase('https://ana-demo.firebaseio.com/sms');

// Twilio details
var ACCOUNT_SID = 'AC07f0d42e3d7ce4e9dc3105b7f318c48d';
var AUTH_TOKEN = process.env.AUTH_TOKEN;
var PHONE_NUMBER = '+15714827462';

// Check for Twilio token as environment variable.
if (!AUTH_TOKEN) {
  console.error('Missing environment variable AUTH_TOKEN.');
  process.exit(1);
}

// Check for AWS secret key as environment variable.
if (!process.env.AWS_SECRET) {
  console.error('Missing environment variable AWS_SECRET.');
  process.exit(1);
}

// Check for command line machine id argument.
var id = process.argv[2];
if (!id) {
  console.error('Missing required argument machine id.');
  process.exit(1);
}

console.log('Listening for requests to ' + id + '...');

var twilio = require('twilio');
var client = new twilio.RestClient(ACCOUNT_SID, AUTH_TOKEN);

// Incoming text message handler
messagesRef.on('child_added', function(snapshot) {
  var sms = snapshot.val();

  // Check if it's a request for this machine
  if (sms.Body.trim() !== id) return;
  // If the message has already been responded to, don't respond again
  if (sms.responded) return;

  console.log('Request from ' + sms.From);

  // Get image from webcam, upload it somewhere publicly accessible.
  require('./webcamCapture')().then(function(url) {
    // Use Twilio to send the URL back to sms.From.
    client.sms.messages.create({
      to: sms.From,
      from: PHONE_NUMBER,
      body: url
    }, function(err, message) {
      if (err) {
        console.error(err.message);
      } else {
        // Mark message as responded to
        var smsRef = messagesRef.child(snapshot.name());
        smsRef.update({responded: true});
      }
    });
  });  
});