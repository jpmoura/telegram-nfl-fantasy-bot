import Twit from 'twit';
import { promisify } from 'util';
import Configuration from '../../../config/Configuration';
import NewsSource from '../../../domain/enum/NewsSource';
import IRepository from '../../../domain/interface/infra/repository/IRepository';
import News from '../../../domain/model/News';

export default class TwitterRepository implements IRepository<News> {
  private T: Twit = new Twit({
    consumer_key: Configuration.twitter.consumer.key,
    consumer_secret: Configuration.twitter.consumer.secret,
    app_only_auth: true,
  });

  private getTweetsFrom(username: string): Promise<any> {
    const promisifyGet = promisify(this.T.get.bind(this.T));

    return promisifyGet('statuses/user_timeline',
      {
        screen_name: username,
        count: 10,
        exclude_replies: true,
        include_rts: false,
        tweet_mode: 'extended',
        trim_user: true,
      }).catch((err: Error) => {
      console.log('Error while getting new tweets', err);
      return err;
    });
  }

  private getTwitterAccounts(): Array<string> {
    return Configuration.twitter.accounts.split(',').map((account: string) => account.trim());
  }

  async list(): Promise<Array<News>> {
    const tweets: Array<News> = [];
    const accounts: Array<string> = this.getTwitterAccounts();

    await Promise.all(accounts.map(async (account) => {
      const accountTweets: Array<Twit.Twitter.Status> = await this.getTweetsFrom(account);

      accountTweets.forEach((tweet) => {
        tweets.push(new News(
          `New Tweet from @${account} 🐦`,
          tweet.truncated ? tweet.text : tweet.full_text,
          NewsSource.Twitter,
        ));
      });
    }));

    return tweets;
  }
}
