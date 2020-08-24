var Twitter = require('twitter');
var swim = require("@swim/client");

const swimClient = new swim.WarpClient();

let valueLane = swimClient.downlinkValue()
                    .hostUri("warp://localhost:9001").nodeUri("/twitter/feed").laneUri("tweets")
                    .didSet((newValue, oldValue) => {
                        // console.log("link watched info change to " + newValue + " from " + oldValue);
                      })
                    .open();
                    
// You can get the API keys from here, https://developer.twitter.com/en/apps
var client = new Twitter({
  consumer_key: "your key",
  consumer_secret: "your consumer secret",
  access_token_key: "your token",
  access_token_secret: "your access keys"
});

/**
 * Stream statuses filtered by keyword
 * number of tweets per second depends on topic popularity
 **/
client.stream('statuses/filter', {track: '#tech'},  function(stream) {
  stream.on('data', function(tweet) {
    let twtObj = {}
    twtObj.msg = tweet.text
    twtObj.url = tweet.user.profile_image_url_https || 'https://i1.pngguru.com/preview/137/834/449/cartoon-cartoon-character-avatar-drawing-film-ecommerce-facial-expression-png-clipart.jpg'
    twtObj.timeStamp = tweet.created_at

    valueLane.set(JSON.stringify(twtObj));
  });

  stream.on('error', function(error) {
    console.log(error);
  });
});