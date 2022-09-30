export default interface IChatRepository {
  insert(chatId: number): Promise<void>;

  list(): Promise<Array<number>>;

  delete(chatId: number): Promise<void>;
}
