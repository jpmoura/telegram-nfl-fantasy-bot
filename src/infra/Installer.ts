import { ContainerModule, interfaces } from 'inversify';
import { Telegraf, Telegram } from 'telegraf';
import { TelegrafContext } from 'telegraf/typings/context';
import Twit from 'twit';
import Types from '../cross-cutting/ioc/Types';
import ILogger from '../domain/interface/infra/repository/log/ILogger';
import IChatRepository from '../domain/interface/infra/repository/message/IChatRepository';
import IMessageRepository from '../domain/interface/infra/repository/message/IMessageRepository';
import INewsRepository from '../domain/interface/infra/repository/news/INewsRepository';
import telegrafClient from './client/TelegrafClient';
import telegramClient from './client/TelegramClient';
import twitterClient from './client/TwitterClient';
import Logger from './log/Logger';
import ChatRepository from './repository/message/ChatRepository';
import MessageRepository from './repository/message/MessageRepository';
import FantasyLeagueTransactionRepository from './repository/news/FantasyLeagueTransactionRepository';
import RotowireRepository from './repository/news/RotowireRepository';
import TwitterRepository from './repository/news/TwitterRepository';

const infraModule = new ContainerModule((bind: interfaces.Bind) => {
  // Log
  bind<ILogger>(Types.Logger).to(Logger);

  // Clients
  bind<Telegraf<TelegrafContext>>(Types.TelegrafClient).toConstantValue(telegrafClient);
  bind<Telegram>(Types.TelegramClient).toConstantValue(telegramClient);
  bind<Twit>(Types.TwitterClient).toConstantValue(twitterClient);

  // Repositories
  const chatRepository = new ChatRepository(new Logger());
  bind<IChatRepository>(Types.ChatRepository).toConstantValue(chatRepository);
  bind<IMessageRepository>(Types.MessageRepository).to(MessageRepository);
  bind<INewsRepository>(Types.FantasyLeagueTransactionRepository)
    .to(FantasyLeagueTransactionRepository);
  bind<INewsRepository>(Types.RotowireRepository).to(RotowireRepository);
  bind<INewsRepository>(Types.TwitterRepository).to(TwitterRepository);
});

export default infraModule;
