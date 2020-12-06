import { Message } from 'telegraf/typings/telegram-types';

export default interface IMessageRepository {
  send(chatId: string | number, message: string): Promise<Message>;
}
