import * as dotenv from 'dotenv';

dotenv.config();

export default class FantasyLeague {
  id: string | undefined = process.env.FANTASY_LEAGUE_ID;

  url: string = 'https://fantasy.nfl.com/league/';
}
