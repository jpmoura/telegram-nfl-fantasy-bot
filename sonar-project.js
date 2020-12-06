const sonarqubeScanner = require('sonarqube-scanner');
const dotenv = require('dotenv');

dotenv.config();

sonarqubeScanner(
  {
    serverUrl: 'https://sonarcloud.io',
    token: process.env.SONARCLOUD_TOKEN,
    options: {
      'sonar.projectKey': 'jpmoura_nfl-news-for-telegram',
      'sonar.organization': 'jpmoura-github',
      'sonar.sources': 'src',
    }
  },
  () => {
    console.log('>> Sonar analysis is done!');
  }
);
