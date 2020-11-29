import { TelegrafContext } from 'telegraf/typings/context';
import { Message } from 'telegraf/typings/telegram-types';
import News from '../../../../model/News';

export default interface ICommandService {
  addUser(ctx: TelegrafContext): Promise<Message>
  removeUser(ctx: TelegrafContext): Promise<Message>
  sendLatest(ctx: TelegrafContext, news: Map<string, News>): Promise<Message>
}
