var imagesnap = require('imagesnap');
var Firebase = require('firebase');
var messagesRef = new Firebase('https://ana-demo.firebaseio.com/sms');

// Twilio details
var ACCOUNT_SID = 'AC07f0d42e3d7ce4e9dc3105b7f318c48d';
var AUTH_TOKEN = process.env.AUTH_TOKEN;
var PHONE_NUMBER = '+15714827462';

if (!AUTH_TOKEN) {
  console.error('Missing environment variable AUTH_TOKEN.');
  process.exit(1);
}

var twilio = require('twilio');
var client = new twilio.RestClient(ACCOUNT_SID, AUTH_TOKEN);

var id = process.argv[2];
if (!id) {
  console.error('Missing required argument machine id.');
  process.exit(1);
}
console.log('Listening for requests to ' + id + '...');

messagesRef.on('child_added', function(snapshot) {
  var sms = snapshot.val();

  if (sms.Body.trim() !== id) return;
  if (sms.responded) return;

  console.log('Request from ' + sms.From);

  // Get image from webcam, upload it somewhere publicly accessible.
  // TODO
  
  // Use Twilio to send the URL back to sms.From.
  client.sms.messages.create({
    to: sms.From,
    from: PHONE_NUMBER,
    body: 'http://upload.wikimedia.org/wikipedia/commons/f/fb/Schematicky_atom.png'
  }, function(err, message) {
    if (err) {
      console.error(err.message);
    } else {
      var smsRef = messagesRef.child(snapshot.name());
      smsRef.update({responded: true});
    }
  });
});