import { inject, injectable } from 'inversify';
import { Logger } from 'tslog';
import Twit from 'twit';
import { promisify } from 'util';
import Configuration from '../../../config/Configuration';
import Types from '../../../cross-cutting/ioc/Types';
import NewsSource from '../../../domain/enum/NewsSource';
import INewsRepository from '../../../domain/interface/infra/repository/news/INewsRepository';
import News from '../../../domain/model/News';

@injectable()
export default class TwitterRepository implements INewsRepository {
  constructor(
    @inject(Types.Logger) private readonly logger: Logger,
    @inject(Types.TwitterClient) private readonly client: Twit,
  ) { }

  private getTweetsFrom(username: string): Promise<any> {
    const promisifyGet = promisify(this.client.get.bind(this.client));

    return promisifyGet('statuses/user_timeline',
      {
        screen_name: username,
        count: 10,
        exclude_replies: true,
        include_rts: false,
        tweet_mode: 'extended',
        trim_user: true,
      }).catch((err: Error) => {
      this.logger.error('Error while getting new tweets', err);
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
