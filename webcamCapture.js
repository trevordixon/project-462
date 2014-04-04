var Q = require('q');
var imagesnap = require('imagesnap');
var Uploader = require('s3-streaming-upload').Uploader;

var deferred;
module.exports = function webcamCapture() {
  // If capture and upload is already in progress, return a promise
  if (deferred) return deferred.promise;
  deferred = Q.defer();

  upload = new Uploader({
    accessKey:    'AKIAI4FKAJOZ5BH4AY2A',
    secretKey:    process.env.AWS_SECRET,
    bucket:       '462',
    objectName:   'Capture ' + (new Date()).toLocaleString() + '.jpg',
    stream:       imagesnap(),
    objectParams: {
      ContentType: 'image/jpeg'
    }
  });

  upload.on('completed', function (err, res) {
    // res.location is the URI for the uploaded image
    deferred.resolve(res.location);
    deferred = undefined;
  });

  upload.on('failed', function (err) {
    deferred.reject(err);
    deferred = undefined;
  });

  return deferred.promise;
};

if (require.main === module) {
  (module.exports)().then(function(res) {
    console.log('success');
    console.log(res);
  }, function() {
    console.log('error');
  });
}
