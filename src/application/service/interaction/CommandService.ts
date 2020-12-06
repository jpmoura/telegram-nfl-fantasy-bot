import { Telegram } from 'telegraf';
import { TelegrafContext } from 'telegraf/typings/context';
import { Message } from 'telegraf/typings/telegram-types';
import ICommandService from '../../../domain/interface/application/service/interaction/ICommandService';
import News from '../../../domain/model/News';
import MessageService from '../message/MessageService';

export default class CommandService implements ICommandService {
  private readonly messageService: MessageService;

  private readonly chats: Set<string | number>;

  constructor(chats: Set<string | number>, mailman: Telegram) {
    this.chats = chats;
    this.messageService = new MessageService(mailman);
  }

  addUser(ctx: TelegrafContext): Promise<Message> {
    this.chats.add(ctx.message.chat.id);
    console.log(`New client ${ctx.message.chat.id} added`);
    return ctx.reply(`Gotcha ${ctx.message.chat.first_name}! From now on you will receive news about NFL as soon them are published 👌`);
  }

  removeUser(ctx: TelegrafContext): Promise<Message> {
    this.chats.delete(ctx.message.chat.id);
    console.log(`Chat ${ctx.message.chat.id} removed from list`);
    return ctx.replyWithMarkdown('Ok then, you will not hear from me anymore 😭\n'
          + 'If you change your mind, just send me `/firstdown` again 😉');
  }

  sendLatest(ctx: TelegrafContext, news: Map<string, News>): Promise<Message> {
    if (news.size > 0) {
      return this.messageService.send(ctx.message.chat.id, news.values().next().value);
    }

    return ctx.reply("Sorry, I don't have news/tweets/fantasy transactions yet 😥");
  }
}
