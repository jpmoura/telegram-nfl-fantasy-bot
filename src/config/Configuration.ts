import BotConfig from './BotConfig';
import TwitterConfig from './twitter/TwitterConfig';
import FantasyConfig from './fantasy/FantasyConfig';

export default class Configuration {
  static bot: BotConfig = new BotConfig();

  static twitter: TwitterConfig = new TwitterConfig();

  static fantasy: FantasyConfig = new FantasyConfig();
}
