export default interface IChatService {
  create(chatId: number): Promise<void>;

  list(): Promise<Array<number>>;

  delete(chatId: number): Promise<void>;
}
