import { inject, injectable } from 'inversify';
import { Telegram } from 'telegraf';
import { Message } from 'telegraf/typings/telegram-types';
import Types from '../../../cross-cutting/ioc/Types';
import IMessageRepository from '../../../domain/interface/infra/repository/message/IMessageRepository';

@injectable()
export default class MessageRepository implements IMessageRepository {
  constructor(@inject(Types.TelegramClient) private readonly telegramClient: Telegram) { }

  async send(chatId: string | number, message: string): Promise<Message> {
    return this.telegramClient.sendMessage(chatId, message, { parse_mode: 'Markdown' });
  }
}
