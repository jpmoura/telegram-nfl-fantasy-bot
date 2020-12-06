import Telegraf, { Telegram } from 'telegraf';
import { TelegrafContext } from 'telegraf/typings/context';
import * as schedule from 'node-schedule';
import { Message } from 'telegraf/typings/telegram-types';
import CommandService from './service/interaction/CommandService';
import GlobalService from './service/interaction/GlobalService';
import HearingService from './service/interaction/HearingService';
import UpdateService from './service/update/UpdateService';
import MessageService from './service/message/MessageService';
import News from '../domain/model/News';
import ChatService from './service/message/ChatService';

export default class BotManager {
  private news = new Map<string, News>();

  private readonly bot: Telegraf<TelegrafContext>;

  private readonly globalService: GlobalService;

  private readonly commandService: CommandService;

  private readonly hearingService: HearingService;

  private readonly updateService: UpdateService;

  private readonly messageService: MessageService;

  private readonly chatService: ChatService;

  constructor(bot: Telegraf<TelegrafContext>, mailman: Telegram) {
    this.bot = bot;
    this.globalService = new GlobalService();
    this.commandService = new CommandService(mailman);
    this.hearingService = new HearingService();
    this.updateService = new UpdateService();
    this.messageService = new MessageService(mailman);
    this.chatService = new ChatService();
  }

  private setupGlobal(): void {
    this.bot.start((ctx) => this.globalService.start(ctx));
    this.bot.help((ctx) => this.globalService.help(ctx));
  }

  private setupCommands(): void {
    this.bot.command('firstdown', async (ctx) => this.commandService.addUser(ctx));
    this.bot.command('fumble', async (ctx) => this.commandService.removeUser(ctx));
    this.bot.command('latest', async (ctx) => this.commandService.sendLatest(ctx, this.news));
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
    const promises: Array<Promise<Message>> = [];
    const chats = this.chatService.list();
    console.log(chats);

    news.forEach((specificNews) => {
      chats.forEach((chat) => {
        promises.push(this.messageService.send(chat, specificNews));
      });
    });

    Promise.all(promises);
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
