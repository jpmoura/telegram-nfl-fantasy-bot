import IUpdateService from '../../../domain/interface/application/service/update/IUpdateService';
import News from '../../../domain/model/News';
import FantasyLeagueTransactionRepository from '../../../infra/repository/fantasy/FantasyLeagueTransactionRepository';
import RotowireRepository from '../../../infra/repository/news/RotowireRepository';
import TwitterRepository from '../../../infra/repository/twitter/TwitterRepository';

export default class UpdateService implements IUpdateService {
  private readonly fantasyRepository = new FantasyLeagueTransactionRepository();

  private readonly twitterRepository = new TwitterRepository();

  private readonly rotowireRepository = new RotowireRepository();

  async update(moment: Date): Promise<Array<News>> {
    let news: Array<News> = [];

    const transactions = await this.fantasyRepository.list();
    const tweets = await this.twitterRepository.list();
    const rotowireNews = await this.rotowireRepository.list();

    news = news.concat(transactions).concat(tweets).concat(rotowireNews);

    console.log(`News updated at ${moment}`);

    return news;
  }
}
