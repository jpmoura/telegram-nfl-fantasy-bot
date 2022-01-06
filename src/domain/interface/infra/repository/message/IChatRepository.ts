export default interface IChatRepository {
  insert(chatId: number): Promise<void>;

  list(): Array<number>;

  delete(chatId: number): Promise<void>;
}
