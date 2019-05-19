import dotenv from 'dotenv'
dotenv.config()

export default {
    league: {
        id: process.env.FANTASY_LEAGUE_ID,
        url: "https://fantasy.nfl.com/league/"
    }
}
