import { Telegraf } from 'telegraf';
import Configuration from '../../config/Configuration';

const telegrafClient = new Telegraf(Configuration.bot.token);

export default telegrafClient;
