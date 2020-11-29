import { Message } from 'telegraf/typings/telegram-types';
import News from '../../../../model/News';

export default interface IMessageService {
  send(chatId: string | number, news: News): Promise<Message>;
}
