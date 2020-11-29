import Telegraf, { Telegram } from 'telegraf';
import { TelegrafContext } from 'telegraf/typings/context';
import * as schedule from 'node-schedule';
import CommandService from './service/interaction/CommandService';
import GlobalService from './service/interaction/GlobalService';
import HearingService from './service/interaction/HearingService';
import UpdateService from './service/update/UpdateService';
import MessageService from './service/message/MessageService';
import News from '../domain/model/News';

export default class BotManager {
  private news = new Map<string, News>();

  private readonly chats: Set<string | number> = new Set();

  private readonly bot: Telegraf<TelegrafContext>;

  private readonly globalService: GlobalService;

  private readonly commandService: CommandService;

  private readonly hearingService: HearingService;

  private readonly updateService: UpdateService;

  private readonly messageService: MessageService;

  constructor(bot: Telegraf<TelegrafContext>, mailman: Telegram) {
    this.bot = bot;
    this.globalService = new GlobalService();
    this.commandService = new CommandService(this.chats, mailman);
    this.hearingService = new HearingService();
    this.updateService = new UpdateService();
    this.messageService = new MessageService(mailman);
  }

  private setupGlobal(): void {
    this.bot.start((ctx) => this.globalService.start(ctx));
    this.bot.help((ctx) => this.globalService.help(ctx));
  }

  private setupCommands(): void {
    this.bot.command('firstdown', (ctx) => this.commandService.addUser(ctx));
    this.bot.command('fumble', (ctx) => this.commandService.removeUser(ctx));
    this.bot.command('latest', (ctx) => this.commandService.sendLatest(ctx, this.news));
  }

  private setupHearings(): void {
    this.bot.hears('Da Bears', (ctx) => this.hearingService.daBears(ctx));
  }

  private setup() {
    this.setupGlobal();
    this.setupCommands();
    this.setupHearings();
    schedule.scheduleJob('* * * * *', (fireDate: Date) => this.update(fireDate));
  }

  private getDiffNews(updatedNews: Array<News>): Array<News> {
    const diffNews = [];

    updatedNews.forEach((element: News) => {
      if (!this.news.has(element.hashCode)) {
        diffNews.push(element);
      }
    });

    return diffNews;
  }

  private broadcast(news: Array<News>) {
    console.log(`Sending new ${news.length} itens`);

    news.forEach((specificNews) => {
      this.chats.forEach((chat) => {
        this.messageService.send(chat, specificNews);
      });
    });
  }

  async update(firedAt: Date) {
    const updatedNews = await this.updateService.update(firedAt);
    const diffNews: Array<News> = this.getDiffNews(updatedNews);
    this.broadcast(diffNews);
    this.news = new Map<string, News>(updatedNews.map((news: News) => [news.hashCode, news]));
  }

  start() {
    this.setup();
    this.bot.startPolling();
    console.log('Bot started');
  }
}
