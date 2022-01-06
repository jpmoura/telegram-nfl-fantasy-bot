import { injectable } from 'inversify';
import { TelegrafContext } from 'telegraf/typings/context';
import IGlobalService from '../../../domain/interface/application/service/interaction/IGlobalService';

@injectable()
export default class GlobalService implements IGlobalService {
  start(ctx: TelegrafContext): void {
    ctx.replyWithMarkdown('Hey, if you want to receive news about the NFL just send me the command'
        + '`/firstdown` and I will start to send you the latest news about the league.'
        + "I'm powered by [NewsAPI.org](https://newsapi.org)");
  }

  help(ctx: TelegrafContext): void {
    ctx.replyWithMarkdown('*Hello there*. I can help you to keep up informed about the NFL.'
        + 'I understand the following actions:\n\n'
        + '`/firstdown` I will put you in my mailing list and will send you every update about the league\n'
        + '`/fumble` I will remove you from my mailing list and you will not receive my updates');
  }
}
