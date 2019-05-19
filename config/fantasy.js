const dotenv = require('dotenv')
dotenv.config()

module.exports = {
    league: {
        id: process.env.FANTASY_LEAGUE_ID,
        url: "https://fantasy.nfl.com/league/"
    }
}
