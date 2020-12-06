import * as crypto from 'crypto';
import NewsSource from '../enum/NewsSource';

export default class News {
  headline: string;

  body: string;

  source: NewsSource;

  constructor(headline: string, body: string, source: NewsSource) {
    this.headline = headline;
    this.body = body;
    this.source = source;
  }

  get hashCode(): string {
    return crypto.createHash('sha256').update(this.body).digest('hex');
  }

  toString(): string {
    return `${this.headline}\n\n${this.body}`;
  }
}
