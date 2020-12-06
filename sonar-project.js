const sonarqubeScanner = require('sonarqube-scanner');

sonarqubeScanner(
  {
    serverUrl: 'https://sonarcloud.io',
    token: 'faa2a8ccaabfe919e20f9fcb612090686acfb19a',
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
