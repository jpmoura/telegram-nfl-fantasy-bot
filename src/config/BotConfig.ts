import * as dotenv from 'dotenv';

dotenv.config();

export default class BotConfig {
  env: string | undefined = process.env.BOT_ENV;

  token: string | undefined = process.env.BOT_TOKEN;
}
