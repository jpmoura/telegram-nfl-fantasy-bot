import * as dotenv from 'dotenv';
import Consumer from './Consumer';

dotenv.config();

export default class TwitterConfig {
  consumer: Consumer = new Consumer();

  accounts: string | undefined = process.env.TWITTER_ACCOUNTS;
}
