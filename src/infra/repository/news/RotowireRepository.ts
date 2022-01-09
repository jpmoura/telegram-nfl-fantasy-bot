import axios, { AxiosResponse } from 'axios';
import cheerio, { Cheerio, CheerioAPI, Element } from 'cheerio';
import { injectable } from 'inversify';
import NewsSource from '../../../domain/enum/NewsSource';
import INewsRepository from '../../../domain/interface/infra/repository/news/INewsRepository';
import News from '../../../domain/model/News';

@injectable()
export default class RotowireRepository implements INewsRepository {
  private rotowireLatestNewsUrl = 'https://www.rotowire.com/football/news.php';

  private getHeadline(rawRotowireNews: Element): string {
    const $: CheerioAPI = cheerio.load('');
    return `Rotowire reports 📃 ${$('.news-update__player-link', rawRotowireNews).text()} - ${$('.news-update__headline', rawRotowireNews).text()}`;
  }

  private getBody(rawRotowireNews: Element): string {
    const $: CheerioAPI = cheerio.load('');
    return `${$('.news-update__news', rawRotowireNews).text()}`;
  }

  private createNews(rawRotowireNews: Element): News {
    return new News(
      this.getHeadline(rawRotowireNews),
      this.getBody(rawRotowireNews),
      NewsSource.Rotowire,
    );
  }

  private toNews(rawNews: Cheerio<Element>): Array<News> {
    const rotowireNews: Array<News> = [];

    rawNews.map((_: number, item: Element) => rotowireNews.push(this.createNews(item)));

    return rotowireNews;
  }

  async list(): Promise<Array<News>> {
    const response: AxiosResponse<string> = await axios(this.rotowireLatestNewsUrl);
    const $: CheerioAPI = cheerio.load(response.data);
    const rawNews: Cheerio<Element> = $('.news-update');
    return this.toNews(rawNews);
  }
}
