import { inject, injectable } from 'inversify';
import * as schedule from 'node-schedule';
import Telegraf from 'telegraf';
import { TelegrafContext } from 'telegraf/typings/context';
import { Message } from 'telegraf/typings/telegram-types';
import Types from '../../cross-cutting/ioc/Types';
import IBotService from '../../domain/interface/application/service/IBotService';
import ICommandService from '../../domain/interface/application/service/interaction/ICommandService';
import IGlobalService from '../../domain/interface/application/service/interaction/IGlobalService';
import IHearingService from '../../domain/interface/application/service/interaction/IHearingService';
import IChatService from '../../domain/interface/application/service/message/IChatService';
import IMessageService from '../../domain/interface/application/service/message/IMessageService';
import IUpdateService from '../../domain/interface/application/service/update/IUpdateService';
import ILogger from '../../domain/interface/infra/repository/log/ILogger';
import News from '../../domain/model/News';

@injectable()
export default class BotService implements IBotService {
  private currentNews = new Map<string, News>();

  constructor(
    @inject(Types.Logger) private readonly logger: ILogger,
    @inject(Types.TelegrafClient) private readonly telegraf: Telegraf<TelegrafContext>,
    @inject(Types.GlobalService) private readonly globalService: IGlobalService,
    @inject(Types.CommandService) private readonly commandService: ICommandService,
    @inject(Types.HearingService) private readonly hearingService: IHearingService,
    @inject(Types.MessageService) private readonly messageService: IMessageService,
    @inject(Types.ChatService) private readonly chatService: IChatService,
    @inject(Types.UpdateService) private readonly updateService: IUpdateService,
  ) { }

  private setupGlobal(): void {
    this.telegraf.start((ctx) => this.globalService.start(ctx));
    this.telegraf.help((ctx) => this.globalService.help(ctx));
  }

  private setupCommands(): void {
    this.telegraf.command('firstdown', async (ctx) => this.commandService.addUser(ctx));
    this.telegraf.command('fumble', async (ctx) => this.commandService.removeUser(ctx));
    this.telegraf.command('latest', async (ctx) => this.commandService.sendLatest(ctx, this.currentNews));
  }

  private setupHearings(): void {
    this.telegraf.hears('Da Bears', (ctx) => this.hearingService.daBears(ctx));
  }

  private setup() {
    this.setupGlobal();
    this.setupCommands();
    this.setupHearings();
    schedule.scheduleJob('* * * * *', (fireDate: Date) => this.update(fireDate));
  }

  private getDiffNews(updatedNews: Array<News>): Array<News> {
    const diffNews = [];

    updatedNews.forEach((news: News) => {
      if (!this.currentNews.has(news.hashCode)) {
        diffNews.push(news);
      }
    });

    return diffNews;
  }

  private broadcast(breakingNews: Array<News>) {
    const promises: Array<Promise<Message>> = [];
    const chats = this.chatService.list();
    this.logger.info(`Sending ${breakingNews.length} breaking news to ${chats.length} chats`);

    breakingNews.forEach((news) => {
      chats.forEach((chat) => {
        promises.push(this.messageService.send(chat, news));
      });
    });

    Promise.all(promises);
  }

  private async update(firedAt: Date) {
    const latestNews = await this.updateService.update(firedAt);
    const breakingNews: Array<News> = this.getDiffNews(latestNews);
    this.broadcast(breakingNews);
    this.currentNews = new Map<string, News>(
      latestNews.map((news: News) => [news.hashCode, news]),
    );
  }

  start() {
    this.setup();
    this.telegraf.startPolling();
    this.logger.info('Bot started');
  }
}
