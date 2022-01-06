import { inject, injectable } from 'inversify';
import Types from '../../../cross-cutting/ioc/Types';
import IUpdateService from '../../../domain/interface/application/service/update/IUpdateService';
import ILogger from '../../../domain/interface/infra/repository/log/ILogger';
import INewsRepository from '../../../domain/interface/infra/repository/news/INewsRepository';
import News from '../../../domain/model/News';

@injectable()
export default class UpdateService implements IUpdateService {
  constructor(
    @inject(Types.Logger) private readonly logger: ILogger,

    @inject(Types.FantasyLeagueTransactionRepository)
    private readonly fantasyLeagueTransactionRepository: INewsRepository,
    @inject(Types.TwitterRepository) private readonly twitterRepository: INewsRepository,
    @inject(Types.RotowireRepository) private readonly rotowireRepository: INewsRepository,
  ) { }

  async update(moment: Date): Promise<Array<News>> {
    let news: Array<News> = [];

    const transactions = await this.fantasyLeagueTransactionRepository.list();
    const tweets = await this.twitterRepository.list();
    const rotowireNews = await this.rotowireRepository.list();

    news = news.concat(transactions).concat(tweets).concat(rotowireNews);

    this.logger.info(`News updated at ${moment}`);

    return news;
  }
}
