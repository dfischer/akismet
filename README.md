akismet
=======

Meteor wrapper for NPM akismet-api

define a settings.yml file for you to run with Meteor to set settings.

```
{
  "Akismet": {
    "key": "required",
    "blog": "required"
  }
}
```

`meteor --settings settings.json`

Then hook into the api as you see fit.

Exposed `verifyKey`, `checkSpam`, `submitSpam`, `submitHam` as the following wrapped methods:

`akismetVerifyKey`, `akismetCheckSpam`, `akismetSubmitSpam`, `akismetSubmitHam`

Just hook into those as you would in your comments code, e.g:

```
// use comment object values somewhere
var checkSpam = {
  user_ip : comment.user_ip,
  user_agent : comment.user_agent,
  referrer : comment.referrer,
  comment_type : 'comment',
  comment_author : comment.author,
  comment_content : comment.body
};

var isSpam = Meteor.call('akismetCheckSpam', checkSpam); // true for spam

if(isSpam) {
  comment.isSpam = true;
  return Comments.insert(comment);
} else {
  Posts.update(comment.postId, {
    $inc: { commentsCount: 1 }
  });
  return Comments.insert(comment);
}
```
