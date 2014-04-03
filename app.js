var Firebase = require('firebase');
var smsRef = new Firebase('https://ana-demo.firebaseio.com/sms');

var id = process.argv[2];
if (!id) {
  console.error('Missing required argument machine id.');
  process.exit(1);
}
console.log('Listening for requests to ' + id + '...');

smsRef.on('child_added', function(snapshot) {
  var sms = snapshot.val();
  if (sms.Body.trim() === id) {
    console.log('Request from ' + sms.From);
    // Get image from webcam, upload it somewhere publicly accessible,
    // and use Twilio to send the URL back to sms.From.
  }
});