export default class Consumer {
  key: string | undefined = process.env.TWITTER_CONSUMER_KEY;

  secret: string | undefined = process.env.TWITTER_CONSUMER_SECRET;
}
