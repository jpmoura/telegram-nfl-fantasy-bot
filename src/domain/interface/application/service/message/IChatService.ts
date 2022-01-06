export default interface IChatService {
  create(chatId: number): Promise<void>;

  list(): Array<number>;

  delete(chatId: number): Promise<void>;
}
