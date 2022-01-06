import Twit from 'twit';
import Configuration from '../../config/Configuration';

const twitterClient = new Twit({
  consumer_key: Configuration.twitter.consumer.key,
  consumer_secret: Configuration.twitter.consumer.secret,
  app_only_auth: true,
});

export default twitterClient;
