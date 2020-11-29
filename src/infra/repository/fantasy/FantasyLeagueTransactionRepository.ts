import axios, { AxiosResponse } from 'axios';
import cheerio from 'cheerio';
import IRepository from '../../../domain/interface/infra/repository/IRepository';
import Configuration from '../../../config/Configuration';
import NewsSource from '../../../domain/enum/NewsSource';
import News from '../../../domain/model/News';

export default class FantasyLeagueTransactionRepository
implements IRepository<News> {
  private getFantasyLeagueUrl(): string {
    return `${Configuration.fantasy.league.url}${Configuration.fantasy.league.id}`;
  }

  async list(): Promise<Array<News>> {
    const transactions: Array<News> = [];

    const response: AxiosResponse<string> = await axios(this.getFantasyLeagueUrl());

    const videoRegex: RegExp = /View\sVideos/gi;
    const newsRegex: RegExp = /View\sNews/gi;
    const spaceRegex: RegExp = /(.)\1{4,}/gi;

    const $: cheerio.Root = cheerio.load(response.data);
    const rawTransactions: cheerio.Cheerio = ($('.textWrap p'));

    rawTransactions.each((_: any, item: any) => {
      let transaction: string = $(item).text();
      transaction = transaction.replace(videoRegex, '').replace(newsRegex, '').replace(spaceRegex, ' ');
      transactions.push(new News('New Transaction on Fantasy League 🔛', transaction, NewsSource.FantasyLeague));
    });

    return transactions;
  }
}
