import Telegram from 'telegraf/telegram';
import Telegraf from 'telegraf';
import { TelegrafContext } from 'telegraf/typings/context';
import BotManager from './src/application/BotManager';
import Configuration from './src/config/Configuration';

const bot: Telegraf<TelegrafContext> = new Telegraf(Configuration.bot.token);
const mailman = new Telegram(Configuration.bot.token);
const botManager: BotManager = new BotManager(bot, mailman);

botManager.start();
