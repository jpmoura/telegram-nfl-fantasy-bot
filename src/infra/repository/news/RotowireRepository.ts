import axios, { AxiosResponse } from 'axios';
import cheerio from 'cheerio';
import { injectable } from 'inversify';
import NewsSource from '../../../domain/enum/NewsSource';
import INewsRepository from '../../../domain/interface/infra/repository/news/INewsRepository';
import News from '../../../domain/model/News';

@injectable()
export default class RotowireRepository implements INewsRepository {
  private rotowireLatestNewsUrl = 'https://www.rotowire.com/football/news.php';

  private getHeadline(rawRotowireNews: any): string {
    const $ = cheerio.load('');
    return `Rotowire reports 📃 ${$('.news-update__player-link', rawRotowireNews).text()} - ${$('.news-update__headline', rawRotowireNews).text()}`;
  }

  private getBody(rawRotowireNews: any): string {
    const $ = cheerio.load('');
    return `${$('.news-update__news', rawRotowireNews).text()}`;
  }

  private createNews(rawRotowireNews: any): News {
    return new News(
      this.getHeadline(rawRotowireNews),
      this.getBody(rawRotowireNews),
      NewsSource.Rotowire,
    );
  }

  private toNews(rawNews: any): Array<News> {
    const rotowireNews: Array<News> = [];

    rawNews.map((_, item) => rotowireNews.push(this.createNews(item)));

    return rotowireNews;
  }

  async list(): Promise<Array<News>> {
    const response: AxiosResponse<string> = await axios(this.rotowireLatestNewsUrl);
    const $ = cheerio.load(response.data);
    const rawNews = $('.news-update');
    return this.toNews(rawNews);
  }
}
