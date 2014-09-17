var Akismet = Npm.require('akismet-api');

if ( Meteor.settings && Meteor.settings.Akismet !== undefined &&
	Meteor.settings.Akismet.key !== undefined &&
	Meteor.settings.Akismet.blog !== undefined ) {

  var client = Akismet.client({
    key  : Meteor.settings.Akismet.key,
    blog : Meteor.settings.Akismet.blog
  });
} else {
	console.log( '[Akismet] Error: Akismet Options have not been set in your settings.json file.' );
}

var wrappedAkismetClient = Async.wrap(client, ['verifyKey', 'checkSpam', 'submitSpam', 'submitHam']);

Meteor.methods({
  'akismetVerifyKey': function() {
    var response = Async.runSync(function(done) {
      client.verifyKey(function(err, valid) {
        if (valid) {
          done(null, 'Successfully authenticated key and blog');
        } else {
          done(new Error(err.message), err.message);
        }
      });
    });
    console.log('Akismet:', response.result);
    return response;
  },
  'akismetCheckSpam': function(comment) {
    var checkSpam = wrappedAkismetClient.checkSpam(comment);
    return checkSpam;
  },
  'akismetSubmitSpam': function(comment) {
    var submitSpam = wrappedAkismetClient.submitSpam(comment);
    return submitSpam;
  },
  'akismetSubmitHam': function(comment) {
    var submitHam = wrappedAkismetClient.submitHam(comment);
    return submitHam;
  }
});

Meteor.call('akismetVerifyKey');
