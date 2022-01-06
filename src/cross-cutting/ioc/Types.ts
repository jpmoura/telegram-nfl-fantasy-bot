const Types = {
  // Singletons
  TelegrafClient: Symbol.for('TelegrafClient'),
  TelegramClient: Symbol.for('TelegramClient'),
  TwitterClient: Symbol.for('TwitterClient'),

  // Services
  BotService: Symbol.for('BotService'),
  GlobalService: Symbol.for('GlobalService'),
  CommandService: Symbol.for('CommandService'),
  HearingService: Symbol.for('HearingService'),
  MessageService: Symbol.for('MessageService'),
  ChatService: Symbol.for('ChatService'),
  UpdateService: Symbol.for('UpdateService'),

  // Repositories
  ChatRepository: Symbol.for('ChatRepository'),
  FantasyLeagueTransactionRepository: Symbol.for('FantasyLeagueTransactionRepository'),
  MessageRepository: Symbol.for('MessageRepository'),
  RotowireRepository: Symbol.for('RotowireRepository'),
  TwitterRepository: Symbol.for('TwitterRepository'),

  // Cross-cutting
  Logger: Symbol.for('Logger'),
};

export default Types;
