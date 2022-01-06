import { Telegram } from 'telegraf';
import Configuration from '../../config/Configuration';

const telegramClient = new Telegram(Configuration.bot.token);

export default telegramClient;
