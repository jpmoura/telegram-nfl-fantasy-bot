import { inject, injectable } from 'inversify';
import { TelegrafContext } from 'telegraf/typings/context';
import { Message } from 'telegraf/typings/telegram-types';
import Types from '../../../cross-cutting/ioc/Types';
import ICommandService from '../../../domain/interface/application/service/interaction/ICommandService';
import IChatService from '../../../domain/interface/application/service/message/IChatService';
import IMessageService from '../../../domain/interface/application/service/message/IMessageService';
import ILogger from '../../../domain/interface/infra/repository/log/ILogger';
import News from '../../../domain/model/News';

@injectable()
export default class CommandService implements ICommandService {
  constructor(
    @inject(Types.Logger) private readonly logger: ILogger,
    @inject(Types.MessageService) private readonly messageService: IMessageService,
    @inject(Types.ChatService) private readonly chatService: IChatService,
  ) { }

  async addUser(ctx: TelegrafContext): Promise<Message> {
    await this.chatService.create(ctx.update.message.chat.id);
    this.logger.info(`New client ${ctx.update.message.chat.id} added`);
    return ctx.reply(`Gotcha ${ctx.update.message.from.first_name}! From now on you will receive news about NFL as soon them are published 👌`);
  }

  async removeUser(ctx: TelegrafContext): Promise<Message> {
    await this.chatService.delete(ctx.update.message.chat.id);
    this.logger.info(`Chat ${ctx.update.message.chat.id} removed from list`);
    return ctx.replyWithMarkdown('Ok then, you will not hear from me anymore 😭\n'
          + 'If you change your mind, just send me `/firstdown` again 😉');
  }

  async sendLatest(ctx: TelegrafContext, news: Map<string, News>): Promise<Message> {
    if (news.size > 0) {
      return this.messageService.send(ctx.update.message.chat.id, news.values().next().value);
    }

    return ctx.reply("Sorry, I don't have news/tweets/fantasy transactions yet 😥");
  }
}
