import axios, { AxiosResponse } from 'axios';
import cheerio from 'cheerio';
import NewsSource from '../../../domain/enum/NewsSource';
import IRepository from '../../../domain/interface/infra/repository/IRepository';
import News from '../../../domain/model/News';

export default class RotowireRepository implements IRepository<News> {
  private rotowireLatestNewsUrl = 'https://www.rotowire.com/football/news.php';

  private getHeadline(rawRotowireNews: cheerio.Element): string {
    const $: cheerio.Root = cheerio.load('');
    return `Rotowire reports 📃 ${$('.news-update__player-link', rawRotowireNews).text()} - ${$('.news-update__headline', rawRotowireNews).text()}`;
  }

  private getBody(rawRotowireNews: cheerio.Element): string {
    const $: cheerio.Root = cheerio.load('');
    return `${$('.news-update__news', rawRotowireNews).text()}`;
  }

  private createNews(rawRotowireNews: cheerio.Element): News {
    return new News(
      this.getHeadline(rawRotowireNews),
      this.getBody(rawRotowireNews),
      NewsSource.Rotowire,
    );
  }

  private toNews(rawNews: cheerio.Cheerio): Array<News> {
    const rotowireNews: Array<News> = [];

    rawNews.map((_, item: cheerio.Element) => rotowireNews.push(this.createNews(item)));

    return rotowireNews;
  }

  async list(): Promise<Array<News>> {
    const response: AxiosResponse<string> = await axios(this.rotowireLatestNewsUrl);
    const $: cheerio.Root = cheerio.load(response.data);
    const rawNews: cheerio.Cheerio = $('.news-update');
    return this.toNews(rawNews);
  }
}
