import { Telegram } from 'telegraf';
import { Message } from 'telegraf/typings/telegram-types';
import IMessageRepository from '../../../domain/interface/infra/repository/message/IMessageRepository';

export default class MessageRepository implements IMessageRepository {
  private mailman: Telegram;

  constructor(mailman: Telegram) {
    this.mailman = mailman;
  }

  async send(chatId: string | number, message: string): Promise<Message> {
    return this.mailman.sendMessage(chatId, message, { parse_mode: 'Markdown' });
  }
}
