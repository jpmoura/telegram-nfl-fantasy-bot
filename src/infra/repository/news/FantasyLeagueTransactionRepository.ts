import axios, { AxiosResponse } from 'axios';
import cheerio from 'cheerio';
import { injectable } from 'inversify';
import Configuration from '../../../config/Configuration';
import NewsSource from '../../../domain/enum/NewsSource';
import INewsRepository from '../../../domain/interface/infra/repository/news/INewsRepository';
import News from '../../../domain/model/News';

@injectable()
export default class FantasyLeagueTransactionRepository implements INewsRepository {
  private getFantasyLeagueUrl(): string {
    return `${Configuration.fantasy.league.url}${Configuration.fantasy.league.id}`;
  }

  async list(): Promise<Array<News>> {
    const transactions: Array<News> = [];

    const response: AxiosResponse<string> = await axios(this.getFantasyLeagueUrl());

    const videoRegex = /View\sVideos/gi;
    const newsRegex = /View\sNews/gi;
    const spaceRegex = /(.)\1{4,}/gi;

    const $ = cheerio.load(response.data);
    const rawTransactions = ($('.textWrap p'));

    rawTransactions.each((_: any, item: any) => {
      let transaction: string = $(item).text();
      transaction = transaction.replace(videoRegex, '').replace(newsRegex, '').replace(spaceRegex, ' ');
      transactions.push(new News('New Transaction on Fantasy League 🔛', transaction, NewsSource.FantasyLeague));
    });

    return transactions;
  }
}
